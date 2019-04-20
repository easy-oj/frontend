import React, { Component } from 'react'
import { Table } from 'antd'
import { TableProps } from 'antd/lib/table'
interface IProps extends TableProps<any> {
  map: object
  keyLabel?: string
  valueLabel?: string
  dataSource?: any
}
export default class MapTable extends Component<IProps> {
  getDataSource = () => {
    const { map } = this.props
    const result = []
    Object.keys(map).forEach(key => {
      result.push({
        key,
        value: map[key]
      })
    })
    return result
  }
  render() {
    const { keyLabel, valueLabel, ...restProps } = this.props
    const columns = [
      {
        title: keyLabel || 'key',
        dataIndex: 'key'
      },
      {
        title: valueLabel || 'value',
        dataIndex: 'value'
      }
    ]
    return (
      <Table
        columns={columns}
        dataSource={this.getDataSource()}
        {...restProps}
      />
    )
  }
}
