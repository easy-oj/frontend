import React, { Component } from 'react'
import { View } from '@/designs'
import { Form, Input, Button, Icon, Spin, message, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import './index.scss'
import { userServices } from '@/services'
import { Dispatch } from 'redux'

interface IProps extends FormComponentProps, RouteComponentProps {
  dispatch?: Dispatch
}
interface IState {
  isSignUpMode: boolean
  loading: boolean
}
class HomeView extends Component<IProps, IState> {
  state: IState = {
    isSignUpMode: false,
    loading: false
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, history, dispatch } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })

        const { isSignUpMode } = this.state
        if (isSignUpMode) {
          userServices
            .register({ ...values })
            .then(() => {
              this.setState({
                isSignUpMode: false
              })
            })
            .catch(() => {
              message.error('注册异常')
            })
            .finally(() => {
              this.setState({
                loading: false
              })
            })
        } else {
          userServices
            .login({ ...values })
            .then(data => {
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
            })
            .catch(err => {
              message.error('登录异常')
            })
            .finally(() => {
              this.setState({
                loading: false
              })
            })
        }
      }
    })
  }
  switchToSignUp = () => {
    this.setState({
      isSignUpMode: true
    })
  }
  switchToLogIn = () => {
    this.setState({
      isSignUpMode: false
    })
  }
  render() {
    const { isSignUpMode, loading } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <Spin
        spinning={loading}
        indicator={<Icon type="loading" />}
        tip="准备就绪"
      >
        <View
          label={
            isSignUpMode ? (
              '注册新账号'
            ) : (
              <React.Fragment>
                登录到 EASY<sup>OJ</sup>
              </React.Fragment>
            )
          }
          action={
            isSignUpMode ? (
              <a role="button" onClick={this.switchToLogIn}>
                已有账号？登录
              </a>
            ) : (
              <React.Fragment />
            )
          }
          className="login-view"
          border
        >
          <Form onSubmit={e => this.handleSubmit(e)}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input autoComplete="off" placeholder="EOJ ID" />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input.Password placeholder="PASSWORDS" />)}
            </Form.Item>
            {
              getFieldDecorator('remember')(<Checkbox>记住我</Checkbox>)
            }
            {isSignUpMode && (
              <Form.Item label="电子邮箱">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <Input autoComplete="off" type="email" placeholder="E-Mail" />
                )}
              </Form.Item>
            )}
            {!isSignUpMode && (
              <React.Fragment>
                <Button htmlType="submit" className="-login-btn" type="primary">
                  登录
                </Button>
                <Button className="-login-btn" onClick={this.switchToSignUp}>
                  快速注册
                </Button>
              </React.Fragment>
            )}
            {isSignUpMode && (
              <Button htmlType="submit" className="-login-btn" type="primary">
                注册
              </Button>
            )}
          </Form>
        </View>
      </Spin>
    )
  }
}

export default connect()(Form.create()(withRouter(HomeView)))
