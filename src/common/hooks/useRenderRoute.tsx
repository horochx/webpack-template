import React, { useState, useMemo } from 'react'
import { Route } from 'react-router'
import { RouteConfig } from '../routeEntry'

export default function(initRoutes: RouteConfig[]) {
  const [routes, setRoutes] = useState(initRoutes)

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

  return [routeMap, routes, setRoutes]
}
