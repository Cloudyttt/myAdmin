import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'http://localhost:3000/table/getList',
    method: 'post',
    data
  })
}
export function createProject(data) {
  return request({
    url: 'http://localhost:3000/table/createProject',
    method: 'post',
    data
  })
}
export function deleteProject(data) {
  return request({
    url: 'http://localhost:3000/table/deleteProject',
    method: 'post',
    data
  })
}
export function updateProject(data) {
  return request({
    url: 'http://localhost:3000/table/updateProject',
    method: 'post',
    data
  })
}
