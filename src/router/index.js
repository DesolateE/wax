import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import LoginPage from '../components/LoginPage.vue'
import Watch from '../components/Watch.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/watch',
    name: 'watch',
    component: Watch
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
