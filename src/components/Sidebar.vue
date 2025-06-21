<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="$emit('close')"
    ></div>
    <aside
      class="fixed inset-y-0 left-0 transform bg-white shadow-md transition-all duration-200 z-50 md:relative overflow-hidden flex flex-col min-h-screen"
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
      <nav class="space-y-6 mt-8">
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Agendamentos</h3>
          <router-link to="/dashboard" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span>Início</span>
          </router-link>
          <router-link to="/agendamentos" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
            </svg>
            <span>Agendamentos</span>
          </router-link>
        </div>
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cadastros</h3>
          <router-link to="/clientes" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="7" r="4" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 21v-2a6 6 0 0112 0v2" />
            </svg>
            <span>Clientes</span>
          </router-link>
          <router-link to="/servicos" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a4 4 0 018 0v2" />
            </svg>
            <span>Serviços</span>
          </router-link>
          <router-link to="/salas" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
            <span>Salas</span>
          </router-link>
        </div>
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Relatórios</h3>
          <router-link to="/faturamento" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M9 17v-4M13 17v-8M17 17V7" />
            </svg>
            <span>Faturamento</span>
          </router-link>
        </div>
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pagamentos</h3>
          <router-link to="/comprovantes" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            <span>Comprovantes</span>
          </router-link>
          <router-link to="/templates" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v4H4V4zm0 6h16v10H4V10z" />
            </svg>
            <span>Templates</span>
          </router-link>
        </div>
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conta</h3>
          <router-link to="/configuracao" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="4" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 21v-2a6 6 0 0112 0v2" />
            </svg>
            <span>Perfil</span>
          </router-link>
          <router-link to="/usuarios" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="4" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 21v-2a6 6 0 0112 0v2" />
            </svg>
            <span>Usuários</span>
          </router-link>
          <router-link to="/minha-assinatura" class="flex items-center text-gray-700 hover:text-blue-600">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke-width="2" />
              <line x1="3" y1="9" x2="21" y2="9" stroke-width="2" />
            </svg>
            <span>Minha Assinatura</span>
          </router-link>
        </div>
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
