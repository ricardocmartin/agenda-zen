<template>
  <Navbar />
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-extrabold text-blue-700">Fale conosco</h2>
        <p class="text-gray-500">Envie sua mensagem e entraremos em contato</p>
      </div>
      <form @submit.prevent="enviar" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="nome">Nome</label>
          <input v-model="nome" id="nome" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">E-mail</label>
          <input v-model="email" id="email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="mensagem">Mensagem</label>
          <textarea v-model="mensagem" id="mensagem" required class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">Enviar</button>
      </form>
      <p v-if="sucesso" class="mt-4 text-green-600 text-center">Mensagem enviada com sucesso!</p>
      <p v-if="erro" class="mt-4 text-red-600 text-center">{{ erro }}</p>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { supabase } from '../supabase'

export default {
  name: 'Contato',
  components: { Navbar, Footer },
  data() {
    return {
      nome: '',
      email: '',
      mensagem: '',
      sucesso: false,
      erro: ''
    }
  },
  methods: {
    async enviar() {
      this.sucesso = false
      this.erro = ''
      const { error } = await supabase.from('contacts').insert({
        name: this.nome,
        email: this.email,
        message: this.mensagem
      })
      if (error) {
        this.erro = 'Erro ao enviar mensagem: ' + error.message
      } else {
        this.sucesso = true
        this.nome = ''
        this.email = ''
        this.mensagem = ''
      }
    }
  }
}
</script>
