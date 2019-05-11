import React, { memo } from 'react'
import Counter from './components/Counter'

function Other() {
  return (
    <div>
      <div>另一个页面</div>
      <Counter />
    </div>
  )
}

export default memo(Other)
