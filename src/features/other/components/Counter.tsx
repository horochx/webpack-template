import React, { useCallback, memo } from 'react'
import { connect } from 'react-redux'
import { addCount, subCount } from '../actions'
import { StoreState } from '@/common/reducerEntry'
import { Dispatch } from 'redux'

interface MapState {
  count: number
}

const mapStateToProps = function(state: StoreState): MapState {
  return {
    count: state.other.count,
  }
}

interface MapDispath {
  addCount: (ount: number) => void
  subCount: (ount: number) => void
}

const mapDispatchToProps = function(dispatch: Dispatch): MapDispath {
  return {
    addCount: count => {
      dispatch(addCount(count))
    },

    subCount: count => {
      dispatch(subCount(count))
    },
  }
}

type Props = MapState & MapDispath

function Counter(props: Props) {
  const addHandler = useCallback(() => {
    props.addCount(1)
  }, [props])

  const subHandler = useCallback(() => {
    props.subCount(1)
  }, [props])

  return (
    <div>
      <button onClick={addHandler}>+</button>
      <span>{props.count}</span>
      <button onClick={subHandler}>-</button>
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(Counter))
