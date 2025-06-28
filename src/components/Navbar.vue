<template>
  <nav class="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b sticky top-0 z-40">
    <router-link to="/" class="text-xl font-semibold text-primary">Agenda Zen</router-link>

    <!-- Botão hambúrguer visível apenas no mobile -->
    <button @click="toggleMenu" class="md:hidden focus:outline-none">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Menu desktop -->
    <div class="hidden md:flex items-center space-x-4">
      <router-link to="/buscar" class="text-primary hover:underline">Buscar</router-link>
      <router-link to="/planos" class="text-primary hover:underline">Planos</router-link>
      <router-link to="/contato" class="text-primary hover:underline">Contato</router-link>
      <router-link to="/login" class="btn">Login</router-link>
    </div>

    <!-- Menu mobile -->
    <div v-if="open" class="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col items-start space-y-4 py-4 px-8">
      <router-link @click="open = false" to="/buscar" class="text-primary hover:underline">Buscar</router-link>
      <router-link @click="open = false" to="/planos" class="text-primary hover:underline">Planos</router-link>
      <router-link @click="open = false" to="/contato" class="text-primary hover:underline">Contato</router-link>
      <router-link @click="open = false" to="/login" class="btn">Login</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      open: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    // fecha o menu automaticamente ao navegar para outra rota
    $route() {
      this.open = false
    }
  },
  methods: {
    toggleMenu() {
      this.open = !this.open
    },
    handleScroll() {
      if (this.open) {
        this.open = false
      }
    }
  }
}
</script>
