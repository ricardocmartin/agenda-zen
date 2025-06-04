<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="$emit('close')"
    ></div>
    <aside
      class="fixed inset-y-0 left-0 transform bg-white shadow-md w-64 h-screen p-6 transition-transform duration-200 z-50 md:relative md:translate-x-0"
      :class="{ '-translate-x-full md:translate-x-0': !isOpen }"
    >
      <h2 class="text-2xl font-bold text-blue-600 mb-6">Agenda Zen</h2>
      <nav class="space-y-4">
        <router-link to="/dashboard" class="block text-gray-700 hover:text-blue-600">Início</router-link>
        <router-link to="/clientes" class="block text-gray-700 hover:text-blue-600">Clientes</router-link>
        <router-link to="/servicos" class="block text-gray-700 hover:text-blue-600">Serviços</router-link>
        <router-link to="/agendamentos" class="block text-gray-700 hover:text-blue-600">Agendamentos</router-link>
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
