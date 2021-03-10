import request from './request'

export function getHomeMenuList() {
    return request({
        url: 'menus'
    })
}