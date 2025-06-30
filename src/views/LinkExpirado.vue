<template>
  <Navbar />
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-white px-4">
    <div class="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-lg text-center space-y-6">
      <img src="/icons/error.svg" alt="Erro" class="w-16 h-16 mx-auto text-red-500" />
      <h1 class="text-2xl font-bold text-red-600">Link expirado ou inválido</h1>
      <p class="text-gray-700">Informe seu e-mail para receber um novo link de confirmação.</p>
      <input v-model="email" type="email" placeholder="seu@email.com"
             class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div class="flex justify-center space-x-4">
        <button @click="reenviarLink" class="btn">Reenviar link</button>
        <router-link to="/" class="btn">Início</router-link>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { supabase } from '../supabase'
import { isValidEmail } from '../utils/format'

export default {
  name: 'LinkExpirado',
  components: { Navbar, Footer },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async reenviarLink() {
      if (!isValidEmail(this.email)) {
        alert('E-mail inválido')
        return
      }
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: this.email
      })
      if (error) {
        alert('Erro ao reenviar link: ' + error.message)
      } else {
        alert('Link reenviado! Verifique seu e-mail.')
      }
    }
  }
}
</script>
