import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:3000/users/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: 'http://localhost:3000/users/getInfo',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: 'http://localhost:3000/users/logout',
    method: 'post',
    data
  })
}
