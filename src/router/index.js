import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from 'views/login/Login.vue'
import Home from 'views/home/Home.vue'

// Home的子路由
import Welcome from 'views/welcome/Welcome.vue'
import Users from 'views/users/Users.vue'
import Rights from 'views/power/rights/Rights.vue'
import Roles from 'views/power/roles/Roles.vue'
import Categories from 'views/goods/categories/Categories.vue'
import Params from 'views/goods/params/Params.vue'
import Goods from 'views/goods/goods/Goods.vue'
import AddGoods from 'views/goods/addgoods/AddGoods.vue'
import Orders from 'views/orders/Orders.vue'
import Reports from 'views/reports/Reports.vue'

Vue.use(VueRouter)

  const routes = [
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
      children: [
        {
          path: '/welcome',
          component: Welcome,
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights,
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods/add',
          component: AddGoods
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports

        }
      ]
    }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  if(to.path == '/login') return next()
  let token = window.sessionStorage.getItem('token') 
  if(!token) return next('/login') 
  next()
})

export default router
