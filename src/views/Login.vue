<template>
    <Navbar />
    <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-white px-4">
      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-lg">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-extrabold text-primary">Entrar</h2>
          <p class="text-gray-500">Acesse sua conta do Agenda Zen</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">E-mail</label>
            <input
              v-model="email"
              @input="clearError"
              type="email"
              id="email"
              placeholder="seu@email.com"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Senha</label>
            <input
              v-model="password"
              @input="clearError"
              type="password"
              id="password"
              placeholder="********"
              class="w-full"
            />
          </div>
          <p v-if="loginError" class="text-red-600 text-center text-sm">
            {{ loginError }}
          </p>
          <button type="submit" class="btn w-full">Entrar</button>
          <button type="button" @click="handleGoogleLogin" class="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200">Entrar com Google</button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-500">
          Ainda não tem conta? <router-link to="/cadastro" class="text-primary hover:underline">Criar agora</router-link>
        </p>
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
  name: 'Login',
  components: { Navbar, Footer },
  data() {
      return {
        email: '',
        password: '',
        loginError: ''
      }
    },
    methods: {
      async handleLogin() {
        this.loginError = ''
        if (this.email && !isValidEmail(this.email)) {
          this.loginError = 'E-mail inválido'
          return
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })

        if (error) {
            if (error.message && error.message.toLowerCase().includes('confirm')) {
              alert('Voc\u00ea precisa confirmar o e-mail antes de acessar o sistema.')
            } else {
              this.loginError = 'E-mail ou senha inválidos'
            }
        } else {
            this.$router.push('/dashboard')
        }
      },
      async handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/#/dashboard' } })
        if (error) {
          alert('Erro ao entrar com Google: ' + error.message)
        }
      },
      clearError() {
        this.loginError = ''
      }
    }
  }
  </script>