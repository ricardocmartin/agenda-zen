<template>
  <Navbar />
  <section class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold text-center mb-8">Conheça nossos planos</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="bg-gray-50 text-gray-700">
            <th class="px-4 py-2 text-left">Recursos</th>
            <th class="px-4 py-2">Grátis</th>
            <th class="px-4 py-2">Básico</th>
            <th class="px-4 py-2">Plus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border-t px-4 py-2 text-gray-600">Agendamentos online</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border-t px-4 py-2 text-gray-600">Lembretes automáticos</td>
            <td class="border-t px-4 py-2 text-center">-</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr>
            <td class="border-t px-4 py-2 text-gray-600">Pagamentos via Pix</td>
            <td class="border-t px-4 py-2 text-center">-</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border-t px-4 py-2 text-gray-600">Suporte prioritário</td>
            <td class="border-t px-4 py-2 text-center">-</td>
            <td class="border-t px-4 py-2 text-center">-</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center mt-8">
      <router-link to="/cadastro" class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Contratar plano
      </router-link>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Planos',
  components: { Navbar, Footer }
}
</script>
