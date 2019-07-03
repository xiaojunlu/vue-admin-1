import { constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = data
        accessedRouters.map(function(item) {
          const item_component = item.component
          item.component = () => import(`@/views/${item_component}`)
          item.children.map(function(child) {
            const child_component = child.component
            child.component = () => import(`@/views/${child_component}`)
          })
        })
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
