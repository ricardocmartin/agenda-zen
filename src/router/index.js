import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Onboarding from '../views/Onboarding.vue'
import Dashboard from '../views/Dashboard.vue'
import Configuracao from '../views/Configuracao.vue'
import Clientes from '../views/Clientes.vue'
import Agendamentos from '../views/Agendamentos.vue'
import Servicos from '../views/Servicos.vue'
import Usuarios from '../views/Usuarios.vue'
import SearchProfiles from '../views/SearchProfiles.vue'
import PublicPage from '../views/PublicPage.vue'
import Planos from '../views/Planos.vue'
import Salas from '../views/Salas.vue'
import Comprovantes from '../views/Comprovantes.vue'
import Templates from '../views/Templates.vue'
import Contato from '../views/Contato.vue'
import MinhaAssinatura from '../views/MinhaAssinatura.vue'
import Faturamento from '../views/Faturamento.vue'
import Faq from '../views/Faq.vue'
import PoliticaPrivacidade from '../views/PoliticaPrivacidade.vue'
import TermosDeUso from '../views/TermosDeUso.vue'
import PagamentoPlus from '../views/PagamentoPlus.vue'
import Confirmacao from '../views/Confirmacao.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/cadastro', name: 'Signup', component: Signup },
  { path: '/confirmacao', name: 'Confirmacao', component: Confirmacao },
  { path: '/login', name: 'Login', component: Login },
  { path: '/onboarding', name: 'Onboarding', component: Onboarding },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/configuracao', name: 'Configuracao', component: Configuracao },
  { path: '/clientes', name: 'Clientes', component: Clientes },
  { path: '/servicos', name: 'Servicos', component: Servicos },
  { path: '/salas', name: 'Salas', component: Salas },
  { path: '/agendamentos', name: 'Agendamentos', component: Agendamentos },
  { path: '/comprovantes', name: 'Comprovantes', component: Comprovantes },
  { path: '/templates', name: 'Templates', component: Templates },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios },
  { path: '/minha-assinatura', name: 'MinhaAssinatura', component: MinhaAssinatura },
  { path: '/assinatura-plus', name: 'PagamentoPlus', component: PagamentoPlus },
  { path: '/faturamento', name: 'Faturamento', component: Faturamento },
  { path: '/buscar', name: 'SearchProfiles', component: SearchProfiles },
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/contato', name: 'Contato', component: Contato },
  { path: '/faq', name: 'Faq', component: Faq },
  { path: '/politica-de-privacidade', name: 'PoliticaDePrivacidade', component: PoliticaPrivacidade },
  { path: '/termos-de-uso', name: 'TermosDeUso', component: TermosDeUso },
  { path: '/:slug', name: 'PublicPage', component: PublicPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Envia page views ao Google Analytics
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', { page_path: to.fullPath })
  }
})

export default router
