import axios from 'axios'
import qs from "qs";
// create an axios instance
const service = axios.create({
  // baseURL: location.host.includes('localhost') ? 'http://niushi.oray.all-dream.com' : '' // api的base_url
})
axios.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'
axios.defaults.timeout = 60000 * 5
axios.paramsSerializer = function (params) {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}
// request 拦截器
service.interceptors.request.use(config => {
  // let token = getToken();
  // 服务器判断是ajax的标识
  // config.headers['x-requested-with'] = 'XMLHttpRequest'
  if (config.method === 'post') {
    config.data = {
      ...config.data,
    }
  } else if (config.method === 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return Promise.resolve(config)
}, error => {
  captureException(error)
  Promise.reject(error)
})
// respone 拦截器
service.interceptors.response.use(response => {
  const res = response.data
  // console.log('res拦截器')
  // console.log(res)
  if (res.status === '-1') {
    // removeToken()
    window.location.reload(true)
    return Promise.reject(new Error())
  } else {
    return response.data
  }
},
error => {
  return Promise.reject(error)
})

const http = {
  get: (url, params) => {
    return service({
      url,
      method: 'get',
      params
    })
  },
  post: (url, data) => {
    return service({
      url,
      method: 'post',
      data
    })
  },
  postFormdata: (url, data) => {
    return service({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformRequest: [
        function(data) {
          let params = ''
          for (let i in data) {
            params += i + '=' + data[i] + '&'
          }
          return params
        },
      ],
      data
    })
  }
}

export default http;