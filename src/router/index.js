import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/cadastro', name: 'Signup', component: Signup }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router