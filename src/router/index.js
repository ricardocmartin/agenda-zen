import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Onboarding from '../views/Onboarding.vue'
import Dashboard from '../views/Dashboard.vue'
import Configuracao from '../views/Configuracao.vue'
import Empresa from '../views/Empresa.vue'
import Clientes from '../views/Clientes.vue'
import Agendamentos from '../views/Agendamentos.vue'
import NovoAgendamento from '../views/NovoAgendamento.vue'
import Servicos from '../views/Servicos.vue'
import Usuarios from '../views/Usuarios.vue'
import SearchProfiles from '../views/SearchProfiles.vue'
import PublicPage from '../views/PublicPage.vue'
import Planos from '../views/Planos.vue'
import Salas from '../views/Salas.vue'
import Comprovantes from '../views/Comprovantes.vue'
import Atendimento from '../views/Atendimento.vue'
import Templates from '../views/Templates.vue'
import Contato from '../views/Contato.vue'
import MinhaAssinatura from '../views/MinhaAssinatura.vue'
import Faturamento from '../views/Faturamento.vue'
import RelatorioAgendamentos from '../views/RelatorioAgendamentos.vue'
import Recebimento from '../views/Recebimento.vue'
import RelatorioEmAberto from '../views/RelatorioEmAberto.vue'
import Faq from '../views/Faq.vue'
import PoliticaPrivacidade from '../views/PoliticaPrivacidade.vue'
import TermosDeUso from '../views/TermosDeUso.vue'
import PagamentoPlus from '../views/PagamentoPlus.vue'
import PagamentoAgendamento from '../views/PagamentoAgendamento.vue'
import Confirmacao from '../views/Confirmacao.vue'
import LinkExpirado from '../views/LinkExpirado.vue'
import Despesas from '../views/Despesas.vue'
import Permissoes from '../views/Permissoes.vue'
import { supabase } from '../supabase'


export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/cadastro', name: 'Signup', component: Signup },
  { path: '/confirmacao', name: 'Confirmacao', component: Confirmacao },
  { path: '/link-expirado', name: 'LinkExpirado', component: LinkExpirado },
  { path: '/login', name: 'Login', component: Login },
  { path: '/onboarding', name: 'Onboarding', component: Onboarding },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/empresa/:id?', name: 'Empresa', component: Empresa },
  { path: '/configuracao', name: 'Configuracao', component: Configuracao },
  { path: '/clientes', name: 'Clientes', component: Clientes },
  { path: '/servicos', name: 'Servicos', component: Servicos },
  { path: '/salas', name: 'Salas', component: Salas },
  { path: '/agendamentos/novo', name: 'NovoAgendamento', component: NovoAgendamento },
  { path: '/agendamentos', name: 'Agendamentos', component: Agendamentos },
  { path: '/comprovantes', name: 'Comprovantes', component: Comprovantes },
  { path: '/despesas', name: 'Despesas', component: Despesas },
  { path: '/templates', name: 'Templates', component: Templates },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios },
  { path: '/permissoes', name: 'Permissoes', component: Permissoes },
  { path: '/minha-assinatura', name: 'MinhaAssinatura', component: MinhaAssinatura },
  { path: '/assinatura-plus', name: 'PagamentoPlus', component: PagamentoPlus },
  { path: '/relatorio-em-aberto', name: 'RelatorioEmAberto', component: RelatorioEmAberto },
  { path: '/relatorio-agendamentos', name: 'RelatorioAgendamentos', component: RelatorioAgendamentos },
  { path: '/recebimento', name: 'Recebimento', component: Recebimento },
  { path: '/faturamento', name: 'Faturamento', component: Faturamento },
  { path: '/buscar', name: 'SearchProfiles', component: SearchProfiles },
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/contato', name: 'Contato', component: Contato },
  { path: '/faq', name: 'Faq', component: Faq },
  { path: '/politica-de-privacidade', name: 'PoliticaDePrivacidade', component: PoliticaPrivacidade },
  { path: '/termos-de-uso', name: 'TermosDeUso', component: TermosDeUso },
  { path: '/atendimento/:id', name: 'Atendimento', component: Atendimento },
  { path: '/pagar-agendamento/:id', name: 'PagamentoAgendamento', component: PagamentoAgendamento },
  { path: '/:slug', name: 'PublicPage', component: PublicPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('onboarding_complete, company_id, role')
      .eq('id', user.id)
      .single()

    if (to.path === '/permissoes' && data?.role === 'user') {
      next('/dashboard')
      return
    }

    if (data && !data.onboarding_complete) {
      if (data.company_id) {
        if (!to.path.startsWith('/empresa')) {
          next('/empresa')
          return
        }
      } else if (to.path !== '/onboarding') {
        next('/onboarding')
        return
      }
    }
  }
  next()
})

// Envia page views ao Google Analytics
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('config', 'G-8DZT2EVSC7', { page_path: to.fullPath })
  }
})

export const screenNames = routes.map(r => r.name)
export const loggedScreenNames = routes
  .filter(r => ![
    'Home',
    'Signup',
    'Login',
    'Confirmacao',
    'LinkExpirado',
    'SearchProfiles',
    'PublicPage',
    'Planos',
    'Contato',
    'Faq',
    'PoliticaDePrivacidade',
    'TermosDeUso',
    'PagamentoPlus',
    'PagamentoAgendamento'
  ].includes(r.name))
  .map(r => r.name)

export default router
