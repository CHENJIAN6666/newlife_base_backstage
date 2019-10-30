import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'
//用于二级菜单
import AppMain from '../views/layout/components/AppMain'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    meta: {title: '系统管理', icon: 'tree'},
    children: [
      {
        path: 'dict',
        component: _import('dict/dict'),
        meta: {title: '字典管理', icon: 'password'},
        menu: 'dict'
      },
      {


        path: '/org',
        component: AppMain,
        redirect: '/org/organizations',
        meta: {title: '组织权限', icon: 'example'},
        children: [
          {
            path: 'organizations',
            component: _import('organizations/organizations'),
            meta: {title: '组织结构', icon: 'example'},
            menu: 'organizations'
          },
          {
            path: 'user', //路径为“/org/user”；如果为空，则是“/org/”
            component: _import('user/user'),
            meta: {title: '用户管理', icon: 'user'},
            menu: 'user'
          },
          {
            path: 'role',
            component: _import('user/role'),
            meta: {title: '角色权限', icon: 'password'},
            menu: 'role'
          },
          {
            path: 'menu',
            component: _import('permission/menu'),
            meta: {title: '菜单管理', icon: 'password'},
            menu: 'menu'
          },
        ]

      },
    ]

  },
 
]
