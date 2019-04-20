import React, { Component } from 'react'
import { default as UserControlView } from './indexView'
import { userServices } from '@/services'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { IUserStore } from '@/reducers/user'
import { Dispatch } from 'redux'
interface IProps extends RouteComponentProps {
  userStore?: IUserStore
  dispatch: Dispatch
}

class UserControl extends Component<IProps> {

  handleAuth = () => {
    const { history, location, userStore, dispatch } = this.props
    if (userStore.id === -1) {
      userServices
        .keep()
        .then(userInfo => {
          dispatch({
            type: 'SAVE_USER_STATE',
            payload: {
              ...userInfo.data.res
            }
          })
        })
        .catch(() => {
          if (location.pathname !== '/login') {
            history.push('/login')
          }
        })
    }
  }
  
  componentDidMount() {
    this.handleAuth()
  }

  componentDidUpdate() {
    const { location, history, userStore } = this.props
    if (location.pathname !== '/login') {
      if (userStore.id === -1) {
        history.push('/login')
      }
    } else {
      if (userStore.id !== -1) {
        history.push('/problems')
      }
    }
  }

  render() {
    const { userStore } = this.props

    if (userStore && userStore.id !== -1) {
      return <UserControlView {...userStore} />
    } else {
      return <React.Fragment />
    }
  }
}

export default connect<{}, {}, {}, any>(({ userStore }) => ({
  userStore
}))(withRouter(UserControl))
