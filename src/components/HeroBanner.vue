<template>
    <section class="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div class="container max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">A sua agenda online que trabalha por você!</h1>
          <p class="text-gray-700 text-lg mb-8">Agendamentos, lembretes automáticos, pagamentos e muito mais — tudo num só lugar.</p>
          <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
            <router-link to="/cadastro" class="btn w-full sm:w-auto inline-flex justify-center px-7 py-3 text-lg md:px-5 md:py-2 md:text-base">
              Teste grátis por 7 dias
            </router-link>
            <router-link to="/login" class="bg-white text-primary w-full sm:w-auto px-7 py-3 text-lg md:px-5 md:py-2 md:text-base rounded-md font-semibold shadow hover:bg-gray-50 text-center">
              Entrar
            </router-link>
          </div>
        </div>
        <div class="flex justify-center">
          <img
            src="/hero-illustration.svg"
            alt="Profissional usando sistema de agendamento online"
            class="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroBanner'
  }
  </script>
