import json
import os
from django.core.management.base import BaseCommand
from django.urls import get_resolver
from django.conf import settings
from django.urls.resolvers import URLPattern, URLResolver
from typing import Dict, List, Any


class Command(BaseCommand):
    help = 'Generate JavaScript routes from Django URLs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='resources/src/utils/routes.ts',
            help='Output file path for generated routes'
        )
        parser.add_argument(
            '--format',
            type=str,
            choices=['ts', 'js'],
            default='ts',
            help='Output format (TypeScript or JavaScript)'
        )

    def handle(self, *args, **options):
        routes = self.extract_routes()
        # Check if ROUTE_GENERATOR settings exist and use them if available
        if hasattr(settings, 'ROUTE_GENERATOR'):
            route_settings = getattr(settings, 'ROUTE_GENERATOR')
            output_path = route_settings.get('OUTPUT_PATH', options['output'])
            output_format = route_settings.get('FORMAT', options['format'])
        else:
            output_path = options['output']
            output_format = options['format']

        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        if output_format == 'ts':
            content = self.generate_typescript_routes(routes)
        else:
            content = self.generate_javascript_routes(routes)

        with open(output_path, 'w') as f:
            f.write(content)

        self.stdout.write(
            self.style.SUCCESS(f'Successfully generated routes to {output_path}')
        )

    def extract_routes(self) -> Dict[str, Any]:
        """Extract all named routes from Django URL configuration"""
        resolver = get_resolver()
        routes = {}

        # Check if admin routes should be included
        include_admin_routes = True
        if hasattr(settings, 'ROUTE_GENERATOR') and 'ADMIN_ROUTES' in settings.ROUTE_GENERATOR:
            include_admin_routes = settings.ROUTE_GENERATOR['ADMIN_ROUTES']

        # Add debug output
        self.stdout.write(self.style.SUCCESS(f"Route generation started. Include admin routes: {include_admin_routes}"))

        def process_url_patterns(patterns, namespace='', prefix=''):
            for pattern in patterns:
                if isinstance(pattern, URLResolver):
                    # Handle included URL patterns
                    new_namespace = namespace
                    if pattern.namespace:
                        new_namespace = f"{namespace}:{pattern.namespace}" if namespace else pattern.namespace

                    # Skip admin routes if ADMIN_ROUTES is False
                    if not include_admin_routes and new_namespace == 'admin':
                        # self.stdout.write(self.style.WARNING(f"Skipping admin namespace: {new_namespace}"))
                        continue

                    new_prefix = prefix + str(pattern.pattern)
                    process_url_patterns(pattern.url_patterns, new_namespace, new_prefix)

                elif isinstance(pattern, URLPattern):
                    if pattern.name:
                        # Extract route name
                        route_name = pattern.name
                        if namespace:
                            route_name = f"{namespace}:{pattern.name}"

                        # Skip admin routes if ADMIN_ROUTES is False
                        if not include_admin_routes and route_name.startswith('admin:'):
                            self.stdout.write(self.style.WARNING(f"Skipping admin route: {route_name}"))
                            continue

                        # Extract route pattern
                        route_pattern = prefix + str(pattern.pattern)

                        # Clean API patterns for better frontend usage
                        # if 'api/' in route_pattern:
                        clean_pattern = self.clean_api_pattern(route_pattern)
                        # else:
                        # clean_pattern = route_pattern

                        # Extract parameters
                        parameters = self.extract_parameters(route_pattern)

                        # Extract HTTP methods
                        methods = self.extract_viewset_methods(pattern.callback)

                        # Store route information
                        routes[route_name] = {
                            'uri': clean_pattern,
                            'methods': methods,
                            'parameters': parameters,
                            'domain': None,  # Django doesn't have domain-specific routes like Laravel
                        }
                        self.stdout.write(self.style.SUCCESS(f"Added route: {route_name}"))

        process_url_patterns(resolver.url_patterns)
        return routes

    def extract_parameters(self, pattern: str) -> List[str]:
        """Extract parameter names from URL pattern"""
        import re

        # Convert Django URL pattern to find named groups
        # Example: ^api/users/(?P<user_id>\d+)/$ -> ['user_id']
        param_pattern = r'\(\?P<(\w+)>[^)]+\)'
        parameters = re.findall(param_pattern, pattern)

        return parameters

    def clean_api_pattern(self, pattern: str) -> str:
        """Clean API pattern to remove DRF format suffix regex"""
        import re

        # Remove regex anchors and clean up DRF format patterns
        pattern = pattern.replace('^', '').replace('$', '')

        # Convert DRF format suffix patterns to cleaner format
        # From: packages\.(?P<format>[a-z0-9]+)/?$ to packages.<format>/
        # Remove format suffix completely or replace with .<format>
        pattern = re.sub(r'\.\(\?P<format>[^)]+\)\??', '.<format>', pattern)

        # Convert pk patterns with format
        # From: packages/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ to packages/<pk>.<format>/
        pattern = re.sub(r'/\(\?P<pk>[^)]+\)\\\.?\(\?P<format>[^)]+\)\?/?', '/<pk>.<format>/', pattern)

        # Convert simple pk patterns
        # From: packages/(?P<pk>[^/.]+)/? to packages/<pk>/
        pattern = re.sub(r'/\(\?P<pk>[^)]+\)\?/?', '/<pk>/', pattern)

        # Convert other parameter patterns
        # From: (?P<param_name>pattern) to <param_name>
        pattern = re.sub(r'\(\?P<(\w+)>[^)]+\)', r'<\1>', pattern)

        # Clean up escaped dots and other regex artifacts
        pattern = pattern.replace('\\.', ".")

        # Clean up trailing slashes
        pattern = pattern.rstrip('/?$')
        if not pattern.endswith('/') and not pattern.endswith('>'):
            pattern += '/'

        return pattern

    def extract_viewset_methods(self, callback) -> List[str]:
        """Extract HTTP methods from ViewSet or view function"""
        methods = ['GET']  # Default method

        try:
            if hasattr(callback, 'actions'):
                # This is a ViewSet with actions
                actions = getattr(callback, 'actions', {})
                if actions:
                    http_methods = []
                    for http_method, action in actions.items():
                        http_methods.append(http_method.upper())
                    methods = http_methods
                else:
                    # Default ViewSet methods
                    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
            elif hasattr(callback, 'view_class'):
                # Check if it's a class-based view
                view_class = getattr(callback, 'view_class', None)
                if view_class and hasattr(view_class, 'http_method_names'):
                    allowed_methods = getattr(view_class, 'http_method_names', ['get'])
                    methods = [m.upper() for m in allowed_methods if m != 'options']
        except Exception:
            # Fallback to GET if we can't determine methods
            methods = ['GET']

        return methods

    def generate_typescript_routes(self, routes: Dict[str, Any]) -> str:
        """Generate TypeScript routes file"""
        routes_json = json.dumps(routes, indent=2)

        return f'''// Auto-generated routes file - DO NOT EDIT
// Generated from Django URLs

export interface RouteParameters {{
  [key: string]: string | number;
}}

export interface RouteDefinition {{
  uri: string;
  methods: string[];
  parameters: string[];
  domain: string | null;
}}

export interface Routes {{
  [key: string]: RouteDefinition;
}}

export const routes: Routes = {routes_json};

export class Router {{
  private readonly routes: Routes;
  private readonly baseUrl: string;

  constructor(routes: Routes, baseUrl = '') {{
    this.routes = routes;
    this.baseUrl = baseUrl.replace(/\\/$/, ''); // Remove trailing slash
  }}

  /**
   * Check if a route exists
   */
  has(name: string): boolean {{
    return name in this.routes;
  }}

  /**
   * Get route definition
   */
  get(name: string): RouteDefinition | undefined {{
    return this.routes[name];
  }}

  /**
   * Generate URL for a named route
   */
  route(name: string, parameters: RouteParameters = {{}}, absolute = false): string {{
    const routeDefinition = this.routes[name];

    if (!routeDefinition) {{
      throw new Error(`Route "${{name}}" not found`);
    }}

    let url = routeDefinition.uri;

    // Replace URL parameter patterns with actual values
    // Handle both Django patterns and cleaned patterns
    
    // Replace cleaned patterns like <param_name>
    url = url.replace(/<(\w+)>/g, (match, paramName) => {{
      if (!(paramName in parameters)) {{
        throw new Error(`Missing required parameter "${{paramName}}" for route "${{name}}"`);
      }}
      return String(parameters[paramName]);
    }});
    
    // Replace Django regex patterns (?P<param_name>pattern)
    url = url.replace(/\(\?P<(\w+)>[^)]+\)/g, (match, paramName) => {{
      if (!(paramName in parameters)) {{
        throw new Error(`Missing required parameter "${{paramName}}" for route "${{name}}"`);
      }}
      return String(parameters[paramName]);
    }});

    // Remove Django regex anchors and clean up
    url = url.replace(/^\^/, '').replace(/\$$/, '').replace(/\\\\\\\./g, '.');

    // Add query parameters for extra parameters
    const usedParams = new Set(routeDefinition.parameters);
    const queryParams = Object.entries(parameters)
      .filter(([key]) => !usedParams.has(key))
      .map(([key, value]) => `${{encodeURIComponent(key)}}=${{encodeURIComponent(String(value))}}`)
      .join('&');

    if (queryParams) {{
      url += url.includes('?') ? '&' + queryParams : '?' + queryParams;
    }}

    // Add base URL if absolute
    if (absolute) {{
      return this.baseUrl + '/' + url.replace(/^\\//, '');
    }}

    return '/' + url.replace(/^\\//, '');
  }}

  /**
   * Get current route name (requires additional setup with React Router)
   */
  current(): string | null {{
    // This would need to be implemented with React Router integration
    return null;
  }}

  /**
   * Get all route names
   */
  list(): string[] {{
    return Object.keys(this.routes);
  }}
}}

// Global router instance
export const router = new Router(routes, import.meta.env.VITE_APP_API_URL || '');

// Helper function for easier usage
export function route(name: string, parameters: RouteParameters = {{}}, absolute = false): string {{
  return router.route(name, parameters, absolute);
}}

// Export route names as constants for better IDE support
export const ROUTES = {{
{self.generate_route_constants(routes)}
}} as const;

export type RouteName = keyof typeof ROUTES;
'''

    def generate_route_constants(self, routes: Dict[str, Any]) -> str:
        """Generate route name constants"""
        constants = []
        for route_name in routes.keys():
            constant_name = route_name.upper().replace(':', '_').replace('-', '_')
            # Check if constant name contains dots, if so wrap it in quotes
            if '.' in constant_name:
                constants.append(f'  "{constant_name}": \'{route_name}\'')
            else:
                constants.append(f"  {constant_name}: '{route_name}'")
        return ',\n'.join(constants)

    def generate_javascript_routes(self, routes: Dict[str, Any]) -> str:
        """Generate JavaScript routes file"""
        routes_json = json.dumps(routes, indent=2)

        return f'''// Auto-generated routes file - DO NOT EDIT
// Generated from Django URLs

const routes = {routes_json};

class Router {{
  constructor(routes, baseUrl = '') {{
    this.routes = routes;
    this.baseUrl = baseUrl.replace(/\\/$/, '');
  }}

  has(name) {{
    return name in this.routes;
  }}

  get(name) {{
    return this.routes[name];
  }}

  route(name, parameters = {{}}, absolute = false) {{
    const routeDefinition = this.routes[name];

    if (!routeDefinition) {{
      throw new Error(`Route "${{name}}" not found`);
    }}

    let url = routeDefinition.uri;

    url = url.replace(/\(\?P<(\w+)>[^)]+\)/g, (match, paramName) => {{
      if (!(paramName in parameters)) {{
        throw new Error(`Missing required parameter "${{paramName}}" for route "${{name}}"`);
      }}
      return String(parameters[paramName]);
    }});

    url = url.replace(/^\^/, '').replace(/\$$/, '');

    const usedParams = new Set(routeDefinition.parameters);
    const queryParams = Object.entries(parameters)
      .filter(([key]) => !usedParams.has(key))
      .map(([key, value]) => `${{encodeURIComponent(key)}}=${{encodeURIComponent(String(value))}}`)
      .join('&');

    if (queryParams) {{
      url += url.includes('?') ? '&' + queryParams : '?' + queryParams;
    }}

    if (absolute) {{
      return this.baseUrl + '/' + url.replace(/^\\//, '');
    }}

    return '/' + url.replace(/^\\//, '');
  }}

  current() {{
    return null;
  }}

  list() {{
    return Object.keys(this.routes);
  }}
}}

export const router = new Router(routes, process.env.REACT_APP_API_URL || '');

export function route(name, parameters = {{}}, absolute = false) {{
  return router.route(name, parameters, absolute);
}}

export {{ routes }};
'''


# 4. Example settings.py additions

"""
# Add to your Django settings.py

INSTALLED_APPS = [
    # ... your other apps
    'routes',
]

# Add middleware for auto-regeneration in development (optional)
MIDDLEWARE = [
    # ... your other middleware
    'routes.middleware.RouteGeneratorMiddleware',  # Add this for auto-regeneration
]

# Route generation settings
ROUTE_GENERATOR = {
    'OUTPUT_PATH': 'frontend/src/utils/routes.ts',
    'FORMAT': 'ts',  # or 'js'
    'AUTO_GENERATE': True,  # Enable auto-generation in development
}
"""

# 5. Example Django URLs.py to test with

"""
# urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    # Simple routes
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),

    # Routes with parameters
    path('users/<int:user_id>/', views.user_detail, name='user.detail'),
    path('users/<int:user_id>/edit/', views.user_edit, name='user.edit'),

    # API routes
    path('api/users/', views.api_users, name='api.users.index'),
    path('api/users/<int:user_id>/', views.api_user_detail, name='api.users.show'),

    # Namespaced routes
    path('admin/', include([
        path('dashboard/', views.admin_dashboard, name='dashboard'),
        path('users/', views.admin_users, name='users'),
    ], namespace='admin')),
]
"""
