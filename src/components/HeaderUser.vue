<template>
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-semibold text-gray-800">{{ title }}</h1>
    <div v-if="userEmail" class="relative">
      <button @click="toggleMenu" class="flex items-center space-x-2 focus:outline-none">
        <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="8" r="4" stroke-width="2" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 21v-2a6 6 0 0112 0v2" />
        </svg>
        <span class="text-gray-600">{{ userEmail }}</span>
        <svg class="w-4 h-4 text-gray-600 transition-transform" :class="{ 'rotate-180': showMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
        <router-link to="/" class="block px-4 py-2 hover:bg-gray-100">Início</router-link>
        <router-link to="/configuracao" class="block px-4 py-2 hover:bg-gray-100">Perfil</router-link>
        <router-link to="/usuarios" class="block px-4 py-2 hover:bg-gray-100">Usuários</router-link>
        <router-link to="/minha-assinatura" class="block px-4 py-2 hover:bg-gray-100">Assinatura</router-link>
        <button @click="handleLogout" class="w-full text-left px-4 py-2 hover:bg-gray-100">Sair</button>
      </div>
    </div>
  </header>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'HeaderUser',
  props: {
    title: {
      type: String,
      default: 'Agenda Zen'
    }
  },
  data() {
    return {
      userEmail: null,
      showMenu: false
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
    } else {
      this.userEmail = user.email
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    async handleLogout() {
      this.showMenu = false
      await supabase.auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>