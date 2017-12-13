import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/userinfo'/*,
    name: '用戶信息',
    hidden: true,
    children: [{
      path: 'userinfo',
      component: _import('user/index')
    }]*/
  },
  {
    path: '/userinfo',
    component: Layout,
    redirect: '/userinfo/index',
    //name: '用户信息',
    hidden: true,
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: "用户信息",
        component: _import('user/index'),
        meta: {title: '用户信息', icon: 'example'}//左侧菜单展示
      }
    ]
  },

  /*
    {path: '*', redirect: '/404', hidden: true}
  */
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: '菜单示例1',
    meta: {title: '菜单示例1', icon: 'example'},
    children: [
      {
        path: 'table',
        name: '表格',
        component: _import('table/index'),
        meta: {title: '表格', icon: 'table'}
      },
      {
        path: 'tree',
        name: '树',
        component: _import('tree/index'),
        meta: {title: '树', icon: 'tree'}
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '表单示例',
        component: _import('form/index'),
        meta: {title: '表单示例', icon: 'form'}
      }
    ]
  },
  {
    path: '/permission',
    name: "权限管理",
    redirect: "/permission/user",
    component: Layout,
    meta: {title: "权限管理", icon: "user"},
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: _import('form/index'),
        meta: {title: '用户管理', icon: 'user'}
      },
      {
        path: 'role',
        name: '角色管理',
        component: _import('permission/role/index'),
        meta: {title: '角色管理', icon: 'user'}
      },
      {
        path: 'module',
        name: '模块管理',
        //component: _import('permission/module/index'),
        component: _import('permission/module/module_tree'),
        meta: {title: '模块管理', icon: 'user'}
      },
      {
        path: 'tree',
        name: '树管理',
        component: _import('tree/tree_list'),
        meta: {title: '树管理', icon: 'user'}
      }
    ]
  }
]
