import { lazy, ComponentType } from 'react'

export interface RouteConfig {
  path: string
  exact?: boolean
  component: ComponentType<any>
  routes?: RouteConfig[]
}

export default [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('@/features/home')),
  },

  {
    path: '/other',
    component: lazy(() => import('@/features/other')),
  },
] as RouteConfig[]
