<template>
  <div class="min-h-screen flex flex-col bg-white">
    <section v-if="profile" class="flex-1">
      <div class="bg-blue-600 text-white py-12">
        <div class="max-w-5xl mx-auto px-4 text-center space-y-4">
          <img src="/hero-illustration.png" alt="Banner" class="w-32 h-32 mx-auto rounded-full shadow-lg" />
          <h1 class="text-4xl font-bold">{{ profile.business_name }}</h1>
          <p class="text-lg">{{ profile.description }}</p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-12 space-y-16">
        <div>
          <h2 class="text-2xl font-semibold text-blue-600 mb-4">Serviços</h2>
          <ul v-if="services.length" class="grid gap-6 md:grid-cols-2">
            <li v-for="service in services" :key="service.id" class="p-4 bg-gray-50 border rounded-lg shadow">
              <h3 class="text-lg font-medium text-blue-700">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
              <p class="text-sm text-gray-500 mt-1">Duração: {{ service.duration }}</p>
            </li>
          </ul>
          <p v-else class="text-gray-500">Nenhum serviço cadastrado.</p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-blue-600 mb-4">Contato</h2>
          <ul class="space-y-1 text-gray-700">
            <li><strong>Telefone:</strong> {{ profile.phone }}</li>
            <li><strong>WhatsApp:</strong> {{ profile.whatsapp }}</li>
            <li><strong>Email:</strong> {{ profile.email }}</li>
            <li><strong>Endereço:</strong> {{ profile.address }}</li>
          </ul>
        </div>
      </div>
    </section>

    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
      <p>Carregando perfil...</p>
    </div>

    <footer v-if="profile" class="bg-gray-100 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center space-y-2">
        <div class="space-x-4 text-blue-600">
          <a v-if="profile.instagram" :href="profile.instagram" class="hover:underline">Instagram</a>
          <a v-if="profile.facebook" :href="profile.facebook" class="hover:underline">Facebook</a>
          <a v-if="profile.youtube" :href="profile.youtube" class="hover:underline">YouTube</a>
          <a v-if="profile.x" :href="profile.x" class="hover:underline">X (Twitter)</a>
        </div>
        <p class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} {{ profile.business_name }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'PublicPage',
  data() {
    return {
      profile: null,
      services: []
    }
  },
  async mounted() {
    const slug = this.$route.params.slug

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (data) {
      this.profile = data
      const { data: servicesData } = await supabase
        .from('services')
        .select()
        .eq('user_id', data.id)

      this.services = servicesData || []
    }
  }
}
</script>
