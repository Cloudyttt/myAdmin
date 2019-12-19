import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
}

const actions = {
  // user login
  login({commit}, userInfo) {
    // console.log('登陆-userInfo:', userInfo)
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {token} = response
        // console.log('code, token, id:', code, token);
        commit('SET_TOKEN', token) // 修改store的token状态
        setToken(token) // 设置Cookie缓存
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    // console.log('拉取用户信息-userInfo')
    return new Promise((resolve, reject) => {
      getInfo({token: state.token}).then(response => {
        const {data} = response
        // console.log('response in getInfo:', response);
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {username, avatar} = data
        console.log('username', username);
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout({token: state.token}).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

