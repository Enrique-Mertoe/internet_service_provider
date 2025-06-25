import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import {RouteParameters} from "@/utils/routes";

interface RouteLinkProps extends Omit<RouterLinkProps, 'to'> {
  route: string;
  params?: RouteParameters;
  absolute?: boolean;
}

export const RouteLink: React.FC<RouteLinkProps> = ({
  route: routeName,
  params = {},
  absolute = false,
  children,
  ...props
}) => {
  const to = route(routeName, params, absolute);

  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
};