import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Layout } from '@/designs'
import {
  withRouter,
  Route,
  Switch,
  RouteComponentProps,
  Redirect
} from 'react-router-dom'

import { LoginView, HomeView, UserControl, ProblemsView, EditorView } from '@/components'
import { IUserStore } from '@/reducers/user'

interface IState {
  accountValidated: boolean
  routes: any[]
}
interface IProps extends RouteComponentProps {
  userStore?: IUserStore
}
class EasyOJ extends Component<IProps, IState> {
  icon = (
    <React.Fragment>
      EASY<sup>OJ</sup>
    </React.Fragment>
  )
  initialRoutes = [
    
    {
      path: '/problems',
      key: '问题',
      component: ProblemsView
    },
    {
      path: '/editor',
      key: '编辑器',
      component: EditorView
    }
  ]
  loginRoutes = [
    {
      path: '/login',
      key: '登录',
      component: LoginView
    }
  ]
  state: IState = {
    accountValidated: false,
    routes: this.initialRoutes
  }

  handleRouteChange = () => {
    const { location } = this.props
    if (location.pathname === '/login') {
      this.setState({
        routes: this.loginRoutes
      })
    } else {
      this.setState({
        routes: this.initialRoutes
      })
    }
  }

  componentDidUpdate() {
    this.handleRouteChange()
  }
  componentDidMount() {
    this.handleRouteChange()
  }
  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    const { routes } = this.state
    const { routes: nextRoutes } = nextState

    const { location } = this.props
    const { location: nextLocation } = nextProps

    return routes !== nextRoutes || location.pathname !== nextLocation.pathname
  }

  render() {
    const { routes } = this.state
    const dynamicRoutes = [...this.initialRoutes, ...this.loginRoutes]

    return (
      <Layout title={this.icon} routes={routes} headerAppend={<UserControl />}>
        <Switch>
          {dynamicRoutes.map(route => {
            const { key, path, component: RouteComponent } = route

            return (
              <Route key={key} path={path}>
                <RouteComponent />
              </Route>
            )
          })}
          <Redirect to="/problems" />
        </Switch>
      </Layout>
    )
  }
}
export default connect<{}, {}, {}, any>(({ userStore }) => ({
  userStore
}))(withRouter(EasyOJ))
