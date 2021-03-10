import axios from 'axios'

export default function request(config) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/'
    })

    //请求拦截器
    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    }, err => {
        console.log(err)
    })

    return instance(config)
}