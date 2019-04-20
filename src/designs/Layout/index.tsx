import './index.scss'

import React, { Component } from 'react'
import classNames from 'class-names'
import Header from './header'

interface IProps {
  className?: string
  title?: string | JSX.Element
  routes?: any[]
  headerAppend?: JSX.Element
}
export default class Layout extends Component<IProps> {
  render() {
    const { className, routes, title, children, headerAppend } = this.props

    return (
      <div className={classNames([className, 'layout'])}>
        <Header title={title} routes={routes} append={headerAppend} />
        <div className="layout-body-wrapper">
          <div className="layout-body">{children}</div>
        </div>
      </div>
    )
  }
}
