import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log("getToken():" + getToken())
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const menus = res.data.menus;
          console.log("menus:" + menus + "   type of menus:" + typeof menus)
          store.dispatch('GenerateRoutes', menus).then(() => {
            console.log(">>>>>>1111111"+router.options.routes+"-----"+store.getters.addRouters+"----"+(typeof store.getters.addRouters)+"-----"+store.getters.addRouters.router)
            const rs = [];
            for(let o of store.getters.addRouters){
              console.log(o.path)
              rs[rs.length] = o;
            }
            //router.addRoutes([])
            router.addRoutes(store.getters.addRouters)
            console.log(">>>>>>1112222"+router.options.routes)
            next({...to})
          })
          next()
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({path: '/login'})
          })
        })
      } else {
        next()
      }
    }
  } else {
    console.log("whiteList.indexOf(to.path)" + whiteList.indexOf(to.path) + "   " + whiteList + "  " + to.path)
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
