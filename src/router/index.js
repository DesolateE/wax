import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import LoginPage from '../components/LoginPage.vue'
import Watch from '../components/Watch.vue'
import Nft from '../components/Nft.vue'
import Noti from '../components/Noti.vue'

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
  },
  {
    path: '/nft',
    name: 'nft',
    component: Nft
  },
  {
    path: '/noti',
    name: 'noti',
    component: Noti
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
