import './index.scss'

import React, { Component } from 'react'
import classNames from 'class-names'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  label?: string | JSX.Element
  action?: JSX.Element
  border?: boolean
  full?: boolean
  scrollable?: boolean
}
export default class View extends Component<IProps> {
  render() {
    const {
      className,
      scrollable,
      label,
      action,
      border,
      full,
      children,
      ...restProps
    } = this.props
    const borderredClassName = border ? '-with-border' : ''
    const scrollableClassName = scrollable ? '-with-scrollable' : ''
    const fulledClassName = full ? '-with-full' : ''
    const hasHeader = !!label
    return (
      <div
        className={classNames([
          className,
          scrollableClassName,
          borderredClassName,
          fulledClassName,
          'view'
        ])}
        {...restProps}
      >
        {hasHeader && (
          <div className="-header">
            <div className="-title">{label || 'untitled'}</div>
            <div className="-action">{action || <React.Fragment />}</div>
          </div>
        )}

        <div className="-body">{children}</div>
      </div>
    )
  }
}
