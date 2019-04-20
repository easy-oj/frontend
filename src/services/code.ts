import axios from 'axios'
import { default as api } from './api'

interface IGetHistory {
  id: number
}
interface ISubmit {
  lid: number
  pid: number
  content: string
}

export default {
  getHistory: (params: IGetHistory) => {
    return axios({
      method: 'get',
      url: api.code.history,
      params
    })
  },
  submit: (params: ISubmit) => {
    return axios({
      method: 'post',
      url: api.code.submit,
      data: params
    })
  }
}
