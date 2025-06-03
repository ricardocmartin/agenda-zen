<template>
    <div class="min-h-screen flex bg-gray-100">
      <Sidebar />
  
      <main class="flex-1 p-8">
        <HeaderUser title="Dashboard" />
  
        <section>
          <p class="text-gray-700 text-lg">Bem-vindo ao painel do Agenda Zen! Aqui você poderá gerenciar seus serviços, agendamentos e personalizações.</p>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import Sidebar from '../components/Sidebar.vue'
  import HeaderUser from '../components/HeaderUser.vue'
  
  export default {
    name: 'Dashboard',
    components: { Sidebar, HeaderUser }
  }
  </script>