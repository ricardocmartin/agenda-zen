<template>
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-semibold text-gray-800">{{ title }}</h1>
    <div v-if="userEmail" class="flex items-center space-x-4">
      <span class="text-gray-600">{{ userEmail }}</span>
      <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Sair</button>
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
      userEmail: null
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
    async handleLogout() {
      await supabase.auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>