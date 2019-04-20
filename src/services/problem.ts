import axios from 'axios'
import { default as api } from './api'

interface IGetList {
  limit?: number
  page: number
}
interface IGetDetail {
  id: number
}

export default {
  getList: (params: IGetList) => {
    return axios({
      method: 'get',
      url: api.problem.list,
      params
    })
  },
  getDetail: (params: IGetDetail) => {
    return axios({
      method: 'get',
      url: api.problem.detail,
      params
    })
  }
}
