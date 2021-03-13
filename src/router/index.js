import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../views/user/User.vue')
const Rights = () => import('../views/power/Rights.vue')
const Roles = () => import('../views/power/Roles.vue')
const Cate = () => import('../views/goods/Cate.vue')

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
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: User
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Cate
            }
        ]
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