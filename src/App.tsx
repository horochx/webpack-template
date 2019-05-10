import { hot } from 'react-hot-loader/root'

import React, { Suspense, useState, useMemo } from 'react'

import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import initRoutes from './common/routes'

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  )
}

function App() {
  const [routes] = useState(initRoutes)

  const routeMap = useMemo(() => {
    return routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)
  }, [routes])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Switch>{routeMap}</Switch>
      </Router>
    </Suspense>
  )
}

export default hot(App)
