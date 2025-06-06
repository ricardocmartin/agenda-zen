<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="$emit('close')"
    ></div>
    <aside
      class="fixed inset-y-0 left-0 transform bg-white shadow-md h-screen transition-all duration-200 z-50 md:relative overflow-hidden"
      :class="isOpen ? 'w-64 p-6 translate-x-0' : 'w-0 p-0 -translate-x-full'"
    >
      <button
        class="absolute top-4 right-4 text-gray-600 focus:outline-none"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-2xl font-bold text-blue-600 mb-6">Agenda Zen</h2>
      <nav class="space-y-4">
        <router-link to="/dashboard" class="block text-gray-700 hover:text-blue-600">Início</router-link>
        <router-link to="/clientes" class="block text-gray-700 hover:text-blue-600">Clientes</router-link>
        <router-link to="/servicos" class="block text-gray-700 hover:text-blue-600">Serviços</router-link>
        <router-link to="/salas" class="block text-gray-700 hover:text-blue-600">Salas</router-link>
        <router-link to="/agendamentos" class="block text-gray-700 hover:text-blue-600">Agendamentos</router-link>
        <router-link to="/comprovantes" class="block text-gray-700 hover:text-blue-600">Comprovantes</router-link>
        <router-link to="/usuarios" class="block text-gray-700 hover:text-blue-600">Usuários</router-link>
        <router-link to="/configuracao" class="block text-gray-700 hover:text-blue-600">Configurações</router-link>
      </nav>
    </aside>
  </div>
</template>
  
<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: true
    }
  }
}
</script>
