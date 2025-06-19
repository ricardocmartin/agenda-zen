import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { supabase } from './supabase'

// Processa tokens ou erros de confirmação enviados pelo Supabase
const handleEmailConfirmation = async () => {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const params = new URLSearchParams(hash)

  if (
    params.get('error_code') === 'otp_expired' ||
    params.get('error_description')?.includes('Email link is invalid')
  ) {
    router.replace('/link-expirado')
    return
  }

  if (
    window.location.hash.includes('access_token') &&
    window.location.hash.includes('type=signup')
  ) {
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      try {
        await supabase.auth.setSession({ access_token, refresh_token })
        router.replace('/confirmacao')
      } catch (_) {
        // ignore
      }
    }
  }
}

handleEmailConfirmation()

// Redireciona para a página de confirmação após validar o e-mail
supabase.auth.onAuthStateChange((event) => {
  if (
    event === 'SIGNED_IN' &&
    window.location.hash.includes('access_token') &&
    window.location.hash.includes('type=signup')
  ) {
    router.replace('/confirmacao')
  }
})

createApp(App).use(router).mount('#app')
