import React from 'react' // eslint-disable-line

declare module 'react' {
  interface HTMLAttributes<T> {
    styleName?: string
  }
}
