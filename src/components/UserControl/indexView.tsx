import React, { Component } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Icon } from 'antd'
interface IProps extends RouteComponentProps {
  username?: string
  id: number
}
class UserControl extends Component<IProps> {
  render() {
    const { username } = this.props
    return (
      <div>
        <Icon type="user" />
        <span> {username}</span>
      </div>
    )
  }
}

export default withRouter(UserControl)
