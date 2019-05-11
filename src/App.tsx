import { hot } from 'react-hot-loader/root'
import React, { Suspense } from 'react'
import { HashRouter as Router, Switch } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducerEntry from '@/common/reducerEntry'
import routeEntry from '@/common/routeEntry'
import useRenderRoute from '@/common/hooks/useRenderRoute'

const store = createStore(
  reducerEntry,
  process.env.NODE_ENV !== 'production' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

function App() {
  const [routeMap] = useRenderRoute(routeEntry)

  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Switch>{routeMap}</Switch>
        </Router>
      </Suspense>
    </Provider>
  )
}

export default hot(App)
