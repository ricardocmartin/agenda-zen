<template>
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-semibold text-gray-800">{{ title }}</h1>
    <div v-if="userEmail" class="relative flex items-center space-x-4">
      <span class="text-gray-600">{{ userEmail }}</span>
      <button @click="toggleMenu" class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Opções</button>
      <div v-if="showMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
        <router-link to="/configuracao" class="block px-4 py-2 hover:bg-gray-100">Configurações</router-link>
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