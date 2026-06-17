//封装axois，简化接口
import axios from 'axios'

const client = axios.create({
  baseURL: '/',
  timeout: 10000,
})

export default client
