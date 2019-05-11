import { OTHER_ADD_COUNT, OTHER_SUB_COUNT } from './actions'

type actions = OTHER_ADD_COUNT | OTHER_SUB_COUNT

export interface OtherState {
  count: number
}

const initState: OtherState = {
  count: 0,
}

export default function(state = initState, action: actions) {
  switch (action.type) {
    case 'OTHER_ADD_COUNT':
      return {
        count: state.count + action.count,
      }

    case 'OTHER_SUB_COUNT':
      return {
        count: state.count - action.count,
      }

    default:
      return state
  }
}
