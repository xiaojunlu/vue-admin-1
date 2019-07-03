import {
  login,
  getUserInfo
} from '@/api/user/index'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    username: '',
    avatar: '',
    status: '',
    truename: '',
    verified_mobile: '',
    email: '',
    roles: 0,
    group: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TRUENAME: (state, truename) => {
      state.truename = truename
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_VERIFIED_MOBILE: (state, verified_mobile) => {
      state.verified_mobile = verified_mobile
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_GROUP: (state, group) => {
      state.group = group
    }
  },

  actions: {
    // 用户名登录
    login({
      commit
    }, userInfo) {
      const {
        username,
        password
      } = userInfo
      return new Promise((resolve, reject) => {
        login({
          username: username.trim(),
          password: password
        }).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.access && data.group_id > 0) {
            commit('SET_ROLES', data.group_id)
          } else {
            reject('拉取用户权限失败')
          }
          commit('SET_USERNAME', data.username)
          commit('SET_AVATAR', data.avatar)
          commit('SET_TRUENAME', data.truename)
          commit('SET_VERIFIED_MOBILE', data.verified_mobile)
          commit('SET_EMAIL', data.email)
          commit('SET_GROUP', data.group)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    logout({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', 0)
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({
      commit,
      dispatch
    }) {
      return new Promise(resolve => {
        getUserInfo().then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_USERNAME', data.username)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
