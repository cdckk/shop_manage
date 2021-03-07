import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')

const routes = [
    {
        path: '/',
        redirect: Login 
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    
    if(to.path === '/login') return next()

    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) next('/login')
    next()
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router