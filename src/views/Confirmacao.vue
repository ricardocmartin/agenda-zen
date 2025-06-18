<template>
  <Navbar />
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center space-y-6">
      <img src="/icons/check.svg" alt="Sucesso" class="w-16 h-16 mx-auto text-green-500" />
      <h1 class="text-2xl font-bold text-green-600">Cadastro efetuado com sucesso</h1>
      <div class="flex justify-center space-x-4">
        <router-link to="/" class="btn inline-block">Início</router-link>
        <router-link to="/login" class="btn inline-block">Login</router-link>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Confirmacao',
  components: { Navbar, Footer }
}
</script>
