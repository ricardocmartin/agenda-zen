import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Configuracao from '../views/Configuracao.vue'
import Clientes from '../views/Clientes.vue'
import PublicPage from '../views/PublicPage.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/cadastro', name: 'Signup', component: Signup },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/configuracao', name: 'Configuracao', component: Configuracao },
  { path: '/clientes', name: 'Clientes', component: Clientes },
  { path: '/:slug', name: 'PublicPage', component: PublicPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router