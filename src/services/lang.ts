import axios from 'axios'
import { default as api } from './api'

export default {
  getList: () => {
    return axios({
      method: 'get',
      url: api.lang.list
    })
  },
  
}
