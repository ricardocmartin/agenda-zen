<template>
  <Navbar />
  <div class="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10">
    <div class="max-w-2xl mx-auto px-4">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-extrabold text-blue-700 mb-4">Buscar perfis</h1>
        <input
          v-model="search"
          type="text"
          placeholder="Digite o nome do estabelecimento"
          class="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <ul class="space-y-4">
        <li
          v-for="profile in filteredProfiles"
          :key="profile.id"
          class="bg-white p-4 rounded-md shadow"
        >
          <h2 class="text-xl font-semibold text-blue-600">{{ profile.business_name }}</h2>
          <p v-if="profile.area_atuacao" class="text-sm text-gray-500">{{ profile.area_atuacao }}</p>
          <p class="text-gray-700 mb-2">{{ profile.description }}</p>
          <router-link
            :to="'/' + profile.slug"
            class="text-blue-600 hover:underline"
          >
            Ver perfil
          </router-link>
        </li>
        <li
          v-if="filteredProfiles.length === 0"
          class="text-center text-gray-500 py-6"
        >
          Nenhum resultado encontrado
        </li>
      </ul>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { supabase } from '../supabase'

export default {
  name: 'SearchProfiles',
  components: { Navbar, Footer },
  data() {
    return {
      profiles: [],
      search: ''
    }
  },
  computed: {
    filteredProfiles() {
      const term = this.search.toLowerCase()
      return this.profiles.filter(p =>
        p.business_name.toLowerCase().includes(term)
      )
    }
  },
  async mounted() {
    const { data } = await supabase
      .from('profiles')
      .select('id, business_name, description, slug, area_atuacao')

    if (data) {
      this.profiles = data
    }
  }
}
</script>
