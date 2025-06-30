<template>
    <section class="text-center py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div class="container mx-auto max-w-5xl px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div class="md:text-left">
            <h1 class="text-5xl font-extrabold mb-6">Sua agenda digital simples e profissional</h1>
            <p class="text-white/80 text-lg mb-8">Perfeita para psicólogos, terapeutas, dentistas, cabeleireiros e mais</p>
            <div class="space-x-4">
                <router-link to="/login" class="bg-white text-primary px-6 py-2 rounded font-semibold shadow hover:bg-gray-50">Entrar</router-link>
                <router-link to="/cadastro" class="btn">Criar conta</router-link>
            </div>
          </div>
          <div>
            <img src="/hero-illustration.png" alt="Ilustração profissional usando a plataforma" class="w-full h-auto mx-auto">
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroBanner'
  }
  </script>