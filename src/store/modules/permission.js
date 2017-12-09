import {asyncRouterMap, constantRouterMap} from '@/router/index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(menus, route, parentPath) {
  const {ms} = menus;
  for (let menu of menus) {
    const path = route.path;
    if (parentPath) {
      if (!parentPath.endsWith("/") && !path.startsWith("/")) {
        parentPath = parentPath + "/"
      }
      path = parentPath + path;
    }
    console.log("menu:" + menu + "   path:" + path + "   " + parentPath)

    if (menu === path) {
      return true;
    }
  }
  return false;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus, parentPath) {
  const accessedRouters = asyncRouterMap.filter(route => {
    let parentPath_tmp = parentPath
    if (hasPermission(menus, route, parentPath_tmp)) {
      if (route.children && route.children.length) {
        if (parentPath_tmp) {
          parentPath_tmp = parentPath_tmp + route.path;
        } else {
          parentPath_tmp = route.path;
        }
        route.children = filterAsyncRouter(route.children, menus, parentPath_tmp)
      }
      return true
    }
    return false
  })
  console.log("asyncRouterMap11111:" + accessedRouters)
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    //向store中的路由数组中添加数据
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({commit}, menus) {
      return new Promise(resolve => {
        console.log("asyncRouterMap:" + asyncRouterMap)
        let accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        for (let rou of accessedRouters) {
          console.log("r111：" + rou)
          for (let rou1 in rou) {
            console.log("r222：" + rou1 + "   " + rou[rou1])
          }
        }
        console.log("accessedRouters:" + accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
