import request from './request'

//请求权限列表数据
export function getRightsList(type) {
    return request({
        url: `rights/${type}`
    })
}

//请求角色列表数据
export function getRolesList() {
    return request({
        url: '/roles'
    })
}

//删除角色指定权限
export function deleteRights(roleId,rightId) {
    return request({
        url: `roles/${roleId.id}/rights/${rightId}`,
        method: 'delete'
    })
}

//角色授权
export function roleByPower(rids,roleId) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        params: {
            rids
        }
    })
}