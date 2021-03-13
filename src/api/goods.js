import request from './request'

//获取分类列表
export function getCategory(queryInfo) {
    return request({
        url: '/categories',
        params: {
          queryInfo
        }
    })
}

//添加分类
export function postCategory(params) {
  return request({
    url: '/categories',
    method: 'post',
    data: params
  })
}