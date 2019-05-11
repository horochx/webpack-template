import { combineReducers } from 'redux'
import other, { OtherState } from '@/features/other/reducers'

export interface StoreState {
  other: OtherState
}

export default combineReducers({
  other,
})
