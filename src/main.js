import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { supabase } from './supabase'

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
