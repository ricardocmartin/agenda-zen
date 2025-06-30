<template>
    <section class="bg-[#eff6ff] py-16 md:py-24">
      <div class="container max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="flex flex-col justify-center text-center md:text-left max-w-lg mx-auto md:mx-0">
          <h1 class="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 md:mb-6">A sua agenda online que trabalha por você!</h1>
          <p class="text-gray-700 text-lg mb-6 md:mb-8">Agendamentos, lembretes automáticos, pagamentos e muito mais — tudo num só lugar.</p>
          <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
            <router-link to="/cadastro" class="btn w-full sm:w-auto px-7 py-3 md:px-6 md:py-3 transition-colors">
              Teste grátis por 7 dias
            </router-link>
            <router-link to="/login" class="w-full sm:w-auto px-7 py-3 md:px-6 md:py-3 rounded-md font-semibold border border-primary text-primary bg-white hover:bg-purple-50 transition-colors text-center">
              Entrar
            </router-link>
          </div>
        </div>
        <div class="flex justify-center md:justify-end md:pr-4 bg-transparent">
          <img
            src="/hero_illustration.png"
            alt="Profissional usando sistema de agendamento online"
            class="max-w-[500px] w-full h-auto rounded-none shadow-none"
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
