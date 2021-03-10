import request from './request'

export function getUserList(params) {
    return request({
        url: '/users',
        params: params
    })
}

export function putUserState(params) {
    return request({
        url: `/users/${params.id}/state/${params.mg_state}`,
        method: 'put'
    })
}

export function addUserForm(params) {
    return request({
        url: '/users',
        method: 'post',
        params: params
    })
}

//通过id获取用户的信息
export function getUserInfoById(params) {
    return request({
        url: `/users/${params.id}`
    })
}

//编辑用户后提交请求
export function putEditUserInfo(editForm) {
    return request({
        url: `users/${editForm.id}`,
        method: 'put',
        params: {
            email: editForm.email,
            mobile: editForm.mobile
        }
    })
}

//删除用户请求
export function deleteUser() {
    return request({
        url: '/users/:id',
        method: 'delete'
    })
}