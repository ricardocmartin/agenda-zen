<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-blue-50">
    <section v-if="profile" class="max-w-6xl mx-auto px-6 py-20 space-y-20 text-gray-800">
      <div class="text-center space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold text-blue-700">{{ profile.business_name }}</h1>
        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{{ profile.description }}</p>
        <a
          v-if="profile.whatsapp"
          :href="`https://wa.me/${profile.whatsapp}`"
          class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Agendar agora
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img src="/hero-illustration.png" alt="Ilustração de destaque" class="w-full rounded-xl shadow-md" />
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-blue-600">Informações de Contato</h2>
          <ul class="space-y-1 text-gray-700">
            <li><strong>Telefone:</strong> {{ profile.phone }}</li>
            <li><strong>WhatsApp:</strong> {{ profile.whatsapp }}</li>
            <li><strong>Email:</strong> {{ profile.email }}</li>
            <li><strong>Endereço:</strong> {{ profile.address }}</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-blue-600">Redes Sociais</h2>
          <ul class="space-y-1 text-blue-600">
            <li v-if="profile.instagram"><a :href="profile.instagram" class="hover:underline">Instagram</a></li>
            <li v-if="profile.facebook"><a :href="profile.facebook" class="hover:underline">Facebook</a></li>
            <li v-if="profile.youtube"><a :href="profile.youtube" class="hover:underline">YouTube</a></li>
            <li v-if="profile.x"><a :href="profile.x" class="hover:underline">X (Twitter)</a></li>
          </ul>
        </div>
        <img src="/about-illustration.png" alt="Ilustração institucional" class="w-full rounded-xl shadow-md" />
      </div>
    </section>

    <div v-else class="text-center py-20 text-gray-500">
      <p>Carregando perfil...</p>
    </div>
  </div>
</template>
  
  <script>
  import { supabase } from '../supabase'
  
  export default {
    name: 'PublicPage',
    data() {
      return {
        profile: null
      }
    },
    async mounted() {
      const slug = this.$route.params.slug
  
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single()
  
      this.profile = data
    }
  }
  </script>