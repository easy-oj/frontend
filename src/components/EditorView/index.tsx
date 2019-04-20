import React, { Component } from 'react'
import { default as EditorView, TDetail } from './indexView'
import Placeholder from './PlaceHolder'
import queryString from 'query-string'

import './index.scss'
import { problemServices } from '@/services'
import { withRouter, RouteComponentProps } from 'react-router'


interface IState {
  loading: boolean
  hasDetail: boolean
  detail?: TDetail
}

interface IProps extends RouteComponentProps {}

class EditorViewEntry extends Component<IProps, IState> {
  state: IState = {
    loading: false,
    hasDetail: false
  }
  componentDidMount() {
    const { location } = this.props

    const { problem_id: problemId } = (queryString.parse(location.search) ||
      {}) as any

    if (problemId) {
      this.setState({
        loading: true,
        hasDetail: true
      })
      problemServices
        .getDetail({
          id: problemId
        })
        .then(response => {
          const detail = response.data.res as TDetail
          this.setState({
            loading: false,
            detail
          })
        })
    }
  }
  render() {
    const { hasDetail, detail, loading } = this.state

    if (hasDetail) {
      return <EditorView hasDetail loading={loading} detail={detail} />
    } else {
      return <Placeholder/>
    }
  }
}

export default withRouter(EditorViewEntry)
