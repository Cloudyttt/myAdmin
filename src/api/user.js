import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:3000/users/login',
    method: 'post',
    data
  })
}

export function getInfo(id, token) {
  return request({
    url: 'http://localhost:3000/users/getInfo',
    method: 'get',
    params: { id, token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
