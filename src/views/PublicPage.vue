<template>
    <div>
      <section v-if="profile" class="max-w-6xl mx-auto px-6 py-16 space-y-16 text-gray-800">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-blue-700 mb-4">{{ profile.business_name }}</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ profile.description }}</p>
        </div>
  
        <div class="flex flex-col md:flex-row items-center gap-8">
          <img src="/hero-illustration.png" alt="Ilustração de destaque" class="w-full md:w-1/2 rounded-xl shadow-md" />
          <div class="w-full md:w-1/2 space-y-3">
            <h2 class="text-xl font-semibold text-blue-600">Informações de Contato</h2>
            <p><strong>Telefone:</strong> {{ profile.phone }}</p>
            <p><strong>WhatsApp:</strong> {{ profile.whatsapp }}</p>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p><strong>Endereço:</strong> {{ profile.address }}</p>
          </div>
        </div>
  
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-full md:w-1/2 space-y-3">
            <h2 class="text-xl font-semibold text-blue-600">Redes Sociais</h2>
            <p v-if="profile.instagram"><a :href="profile.instagram" class="text-blue-600 hover:underline">Instagram</a></p>
            <p v-if="profile.facebook"><a :href="profile.facebook" class="text-blue-600 hover:underline">Facebook</a></p>
            <p v-if="profile.youtube"><a :href="profile.youtube" class="text-blue-600 hover:underline">YouTube</a></p>
            <p v-if="profile.x"><a :href="profile.x" class="text-blue-600 hover:underline">X (Twitter)</a></p>
          </div>
          <img src="/about-illustration.png" alt="Ilustração institucional" class="w-full md:w-1/2 rounded-xl shadow-md" />
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