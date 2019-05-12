import React, { useMemo } from 'react'
import { Route } from 'react-router'
import { RouteConfig } from '../routeEntry'

export default function(routes: RouteConfig[]) {
  const routeMap = useMemo(() => {
    return routes.map((route, i) => (
      <Route
        key={i}
        path={route.path}
        exact={route.exact}
        render={props => <route.component {...props} routes={route.routes} />}
      />
    ))
  }, [routes])

  return routeMap
}
