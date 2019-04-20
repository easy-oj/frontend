import axios from 'axios'
import { default as api } from './api'

interface IGetDetail {
  id: number
}
interface IStatus {
  compileError: string

  id: number
  lid: number
  pid: number
  status: string
  submittedAt: number
  uid: number
}

export default {
  getDetail: (params: IGetDetail) => {
    return axios({
      method: 'get',
      url: api.submission.detail,
      params
    })
  }
}
