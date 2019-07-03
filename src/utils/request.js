import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import myconfig from '@/config'
import {
  getToken,
  removeToken,
  getSignature
} from '@/utils/auth'
import qs from 'qs'

const baseURL = process.env.NODE_ENV === 'production' ?
  myconfig.baseUrl.pro :
  myconfig.baseUrl.dev

// create an axios instance
const service = axios.create({
  baseURL: baseURL, // api 的 base_url
  timeout: 10000, // request timeout,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 在请求发出之前进行一些操作
    config.headers['x-access-appid'] = myconfig.appid
    // token
    if (store.getters.token) {
      config.headers['x-access-token'] = getToken()
    }

    // 将对象 序列化成URL的形式，以&进行拼接
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    } else if (config.method === 'get') {

    }

    // if (config.method === 'post') {
    //   config.data = getSignature(config.data)
    //   config.data = qs.stringify(config.data)
    // } else if (config.method === 'get') {
    //   config.params = getSignature(config.params)
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    console.log(response)
    return response
    // const res = response.data
    // //TODO重构
    // if (res.code !== 10000) {
    //   Message({
    //     message: res.msg,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   // token 过期了
    //   if (res.code === 10305 || res.code === 10307) {
    //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('logout').then(() => {
    //         // 清空token
    //         removeToken()
    //         location.reload() // 为了重新实例化vue-router对象 避免bug
    //       })
    //     })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   return response.data
    // }
  },
  error => {
    const res = error.response.data
    Message({
      message: res.error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
