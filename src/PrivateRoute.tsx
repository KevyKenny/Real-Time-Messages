import React from "react";
import { Route, Redirect, RouteProps } from "react-router";

interface PrivateRouteProps extends RouteProps {
  authenticated: boolean;
  redirectPath: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  authenticated,
  redirectPath,
  ...rest
}) => {
  return authenticated ? <Route {...rest} /> : <Redirect to={redirectPath} />;
};

export default PrivateRoute;
