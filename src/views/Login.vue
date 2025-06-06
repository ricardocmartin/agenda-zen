<template>
    <Navbar />
    <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-extrabold text-blue-700">Entrar</h2>
          <p class="text-gray-500">Acesse sua conta do Agenda Zen</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">E-mail</label>
            <input v-model="email" type="email" id="email" placeholder="seu@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Senha</label>
            <input v-model="password" type="password" id="password" placeholder="********" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">Entrar</button>
          <button type="button" @click="handleGoogleLogin" class="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200">Entrar com Google</button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-500">
          Ainda não tem conta? <router-link to="/cadastro" class="text-blue-600 hover:underline">Criar agora</router-link>
        </p>
      </div>
    </section>
    <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { supabase } from '../supabase'

export default {
  name: 'Login',
  components: { Navbar, Footer },
  data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      async handleLogin() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })

        if (error) {
            alert('Erro ao entrar: ' + error.message)
        } else {
            this.$router.push('/dashboard')
        }
      },
      async handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/#/dashboard' } })
        if (error) {
          alert('Erro ao entrar com Google: ' + error.message)
        }
      }
    }
  }
  </script>