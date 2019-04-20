import axios from 'axios'
import { default as api } from './api'
import toFormData from '@/util/object-to-form-data'

axios.interceptors.request.use(config => {
  const contentType = config.headers['Content-Type']
  if (contentType === 'multipart/form-data') {
    config.data = toFormData(config.data)
  }

  return config
})

export interface IRegister {
  email: string
  username: string
  password: string
}
export interface ILogin {
  username: string
  password: string
  remember: boolean
}

export default {
  register: (params: IRegister) => {
    return new Promise<any>((resolve, reject) => {
      axios({
        method: 'post',
        url: api.user.register,
        data: params
      })
        .then(response => {
          const { res } = response.data
          resolve(res)
        })
        .catch(reason => {
          reject(reason)
        })
    })
  },
  keep: () => {
    return axios({
      method: 'get',
      url: api.user.info,
      // validateStatus: () => true
    })
  },
  login: (params: ILogin) => {
    return new Promise<any>((resolve, reject) => {
      axios({
        method: 'post',
        url: api.user.login,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: params
      })
        .then(() => {
          resolve()
        })
        .catch(reason => {
          reject(reason)
        })
    })
  }
}
