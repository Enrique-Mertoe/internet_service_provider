import {useCallback} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {route, router, RouteParameters, RouteName} from '@/utils/routes';

export interface UseRouteReturn {
    route: (name: string, parameters?: RouteParameters, absolute?: boolean) => string;
    navigate: (name: string, parameters?: RouteParameters, options?: { replace?: boolean; state?: any }) => void;
    current: () => string | null;
    is: (name: string, parameters?: RouteParameters) => boolean;
    has: (name: string) => boolean;
    params: () => Record<string, string>;
}

export function useRoute(): UseRouteReturn {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateToRoute = useCallback((
        name: string,
        parameters: RouteParameters = {},
        options: { replace?: boolean; state?: any } = {}
    ) => {
        const url = route(name, parameters);
        navigate(url, options);
    }, [navigate]);

    const getCurrentRoute = useCallback(() => {
        // This would need to be enhanced with a route matcher
        // For now, return pathname
        return location.pathname;
    }, [location.pathname]);

    const isCurrentRoute = useCallback((name: string, parameters: RouteParameters = {}) => {
        try {
            const routeUrl = route(name, parameters);
            return location.pathname === routeUrl;
        } catch {
            return false;
        }
    }, [location.pathname]);

    const hasRoute = useCallback((name: string) => {
        return router.has(name);
    }, []);

    const getParams = useCallback(() => {
        // Extract parameters from current URL
        // This would need React Router params
        const searchParams = new URLSearchParams(location.search);
        const params: Record<string, string> = {};

        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }

        return params;
    }, [location.search]);

    return {
        route,
        navigate: navigateToRoute,
        current: getCurrentRoute,
        is: isCurrentRoute,
        has: hasRoute,
        params: getParams,
    };
}