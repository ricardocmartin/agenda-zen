<template>
    <aside class="w-64 bg-white shadow-md h-screen p-6">
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
  </template>
  
  <script>
  export default {
    name: 'Sidebar'
  }
  </script>