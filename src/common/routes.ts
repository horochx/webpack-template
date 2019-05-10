import { lazy } from 'react'

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
]
