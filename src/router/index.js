import Vue from 'vue'
import Router from 'vue-router'
// 导入登录组件
import Login from '@/components/login'
// 导入home组件
import Home from '@/components/home'
// 导入欢迎组件
import Welcome from '@/components/welcome'
// 导入users组件
import Users from '@/components/user/users'
// 导入rights组件
import Right from '@/components/power/rights'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{path: '/welcome', component: Welcome}, {path: '/users', component: Users}, {path: '/rights', component: Right}]
    }
  ]
})
// 路由导航守卫的语法
router.beforeEach((to, from, next) => {
  // 如果用户访问的是 登录页面 直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = sessionStorage.getItem('token')
  // 如果token 存在， 直接放行
  if (tokenStr) return next()
  // 否则，强制跳转到登录页
  next('/login')
})

export default router
