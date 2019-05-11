import { Action } from 'redux'

export type OTHER_ADD_COUNT = Action<'OTHER_ADD_COUNT'> & {
  count: number
}

export function addCount(count: number): OTHER_ADD_COUNT {
  return {
    type: 'OTHER_ADD_COUNT',
    count,
  }
}

export type OTHER_SUB_COUNT = Action<'OTHER_SUB_COUNT'> & {
  count: number
}

export function subCount(count: number): OTHER_SUB_COUNT {
  return {
    type: 'OTHER_SUB_COUNT',
    count,
  }
}
