<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8 space-y-6">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Minha Assinatura" />

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 class="text-xl font-semibold text-center">Básico</h3>
          <p class="text-center text-2xl font-bold text-blue-600">Grátis</p>
          <ul class="space-y-2">
            <li class="flex items-start"><span class="mr-2">✓</span>Cadastro de até 5 pacientes</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Lembretes por e-mail</li>
            <li class="flex items-start line-through text-gray-400"><span class="mr-2">✓</span>Lembretes via WhatsApp</li>
            <li class="flex items-start line-through text-gray-400"><span class="mr-2">✓</span>Customização de domínio da página pública</li>
            <li class="flex items-start line-through text-gray-400"><span class="mr-2">✓</span>Página pública sem banner do Agenda Zen</li>
            <li class="flex items-start line-through text-gray-400"><span class="mr-2">✓</span>Geração de recibos de atendimentos</li>
            <li class="flex items-start line-through text-gray-400"><span class="mr-2">✓</span>Envio de recibos por e-mail automático</li>
          </ul>
          <button class="btn mt-4 w-full" @click="goBasico">Escolher</button>
        </div>
        <div class="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 class="text-xl font-semibold text-center">Beta</h3>
          <p class="text-center text-2xl font-bold line-through text-gray-400">R$167,90</p>
          <ul class="space-y-2">
            <li class="flex items-start"><span class="mr-2">✓</span>Cadastro de pacientes ilimitado</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Lembretes por e-mail</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Lembretes via WhatsApp</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Customização de domínio da página pública</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Página pública sem banner do Agenda Zen</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Geração de recibos de atendimentos</li>
            <li class="flex items-start"><span class="mr-2">✓</span>Envio de recibos por e-mail automático</li>
          </ul>
          <button class="btn mt-4 w-full" @click="goBeta">Escolher</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'

export default {
  name: 'MinhaAssinatura',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768
    }
  },
  methods: {
    goBeta() {
      this.$router.push('/assinatura-plus')
    },
    goBasico() {
      this.$router.push('/dashboard')
    }
  }
}
</script>
