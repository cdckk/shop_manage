import request from './request'

export function loginRequest(params) {
    return request({
        url: '/login',
        method: 'post',
        params: params
    })
}