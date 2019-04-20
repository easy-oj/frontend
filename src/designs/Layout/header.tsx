import React, { Component } from 'react'
import { Radio } from 'antd'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'

interface IProps extends RouteComponentProps {
  title: string | JSX.Element
  homePath?: string
  routes?: any[]
  append?: JSX.Element
}

class Header extends Component<IProps> {
  handleBackHome = () => {
    const { history, homePath } = this.props
    const realHomePath = homePath || '/'
    history.push(realHomePath)
  }
  render() {
    const { title, routes, location, append } = this.props
    const matchResult = location.pathname.match(/(^\/.*)\/?.*/)[1]

    return (
      <div className="layout-header-wrapper">
        <div className="layout-header">
          <h1 onClick={this.handleBackHome}>{title}</h1>
          <div className="-routes">
            {routes && (
              <Radio.Group size="small" value={matchResult} buttonStyle="solid">
                {routes.map(route => {
                  const { key, path } = route

                  return (
                    <Radio.Button key={key} value={path}>
                      <Link to={path}>{key}</Link>
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
            )}
          </div>
          <div className="-append">{append || React.Fragment}</div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)
