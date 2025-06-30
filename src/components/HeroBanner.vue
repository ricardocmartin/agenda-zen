<template>
    <section class="text-center py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
      <div class="container mx-auto max-w-5xl px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div class="md:text-left">
          <h1 class="text-5xl font-extrabold mb-6">A sua agenda online que trabalha por você!</h1>
          <p class="text-white/80 text-lg mb-8">Agendamentos, lembretes automáticos, pagamentos e muito mais — tudo num só lugar.</p>
          <div class="space-x-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <router-link to="/cadastro" class="btn inline-flex items-center justify-center px-7 py-3 text-lg md:px-5 md:py-2 md:text-base">
              <img src="/icons/check.svg" alt="" class="w-5 h-5 mr-2" />
              Crie sua agenda gratuita
            </router-link>
            <router-link to="/login" class="bg-white text-primary px-6 py-2 rounded font-semibold shadow hover:bg-gray-50">Entrar</router-link>
          </div>
          </div>
          <div>
            <img src="/hero-illustration.svg" alt="Ilustração profissional usando a plataforma" class="w-full h-auto mx-auto">
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