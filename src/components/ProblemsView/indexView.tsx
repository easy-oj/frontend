import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { List, Icon, Tag, Spin } from 'antd'
import { View } from '@/designs'
import { problemServices } from '@/services'
import { Link } from 'react-router-dom'

type TProblem = {
  acceptedCount: number
  id: number
  name: string
  submittedCount: number
}

interface IState {
  data: TProblem[]
  page: number
  hasMore: boolean
  total: number
  loading: boolean
}

class ProblemsView extends Component<{}, IState> {
  state: IState = {
    data: [],
    hasMore: true,
    page: 1,
    total: -1,
    loading: false
  }
  handleInfiniteOnLoad = () => {
    const { data, page, total } = this.state
    this.setState({
      loading: true
    })
    problemServices
      .getList({
        page,
        limit: 20
      })
      .then(response => {
        const { res } = response.data
        const newData = data.concat(res)
        console.log(page + 1 <= total)
        this.setState({
          data: newData,
          page: page + 1,
          hasMore: page + 1 <= total,
          loading: false
        })
      })
  }
  componentDidMount() {
    const { data, page, total } = this.state
    this.setState({
      loading: true
    })
    problemServices
      .getList({
        page,
        limit: 20
      })
      .then(response => {
        const { res } = response.data
        this.setState({
          data: data.concat(res),
          page: page + 1,
          hasMore: page + 1 <= total,
          loading: false
        })
        if (total === -1) {
          this.setState({
            total
          })
        }
      })
  }
  render() {
    const { data, loading, hasMore } = this.state
    return (
      <View label="问题" full>
        <div className="problem-list-wrapper">
          <InfiniteScroll
            initialLoad={false}
            pageStart={1}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={hasMore}
            useWindow={false}
          >
            <List
              className="problem-list"
              dataSource={data}
              renderItem={item => {
                const { id, name, acceptedCount, submittedCount } = item
                return (
                  <React.Fragment>
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={
                          <div>
                            <span className="-id">{id}</span>
                            <Link
                              to={`/editor?problem_id=${id}`}
                              className="-name"
                            >
                              {name}
                            </Link>
                          </div>
                        }
                      />
                      <div className="-operation">
                        {acceptedCount ? (
                          <Tag className="-ac">
                            <strong>通过 {acceptedCount} 次</strong>
                          </Tag>
                        ) : (
                          <React.Fragment />
                        )}
                        {submittedCount ? (
                          <Tag>提交 {submittedCount} 次</Tag>
                        ) : (
                          <Tag>从未提交</Tag>
                        )}
                        <Link to={`/editor?problem_id=${id}`}>挑战</Link>
                      </div>
                    </List.Item>
                    {loading && (
                      <div className="-loading">
                        <Spin
                          spinning={loading}
                          indicator={<Icon type="loading" />}
                        />
                      </div>
                    )}
                  </React.Fragment>
                )
              }}
            />
          </InfiniteScroll>
        </div>
      </View>
    )
  }
}

export default ProblemsView
