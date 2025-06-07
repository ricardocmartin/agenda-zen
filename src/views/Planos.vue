<template>
  <Navbar />
  <section class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold text-center mb-8">Conheça nossos planos</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="bg-gray-50 text-gray-700">
            <th class="px-4 py-2 text-left">Recursos</th>
            <th class="px-4 py-2">Básico</th>
            <th class="px-4 py-2">Plus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border-t px-4 py-2 text-gray-600">Valor</td>
            <td class="border-t px-4 py-2 text-center font-semibold">Grátis</td>
            <td class="border-t px-4 py-2 text-center font-semibold">R$69,00</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border-t px-4 py-2 text-gray-600">Cadastro de pacientes</td>
            <td class="border-t px-4 py-2 text-center">Até 5 pacientes</td>
            <td class="border-t px-4 py-2 text-center">Ilimitado</td>
          </tr>
          <tr>
            <td class="border-t px-4 py-2 text-gray-600">Lembretes por e-mail</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border-t px-4 py-2 text-gray-600">Lembretes via WhatsApp</td>
            <td class="border-t px-4 py-2 text-center line-through text-gray-400">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr>
            <td class="border-t px-4 py-2 text-gray-600">Customização de domínio da página pública</td>
            <td class="border-t px-4 py-2 text-center line-through text-gray-400">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border-t px-4 py-2 text-gray-600">Página pública sem banner do Agenda Zen</td>
            <td class="border-t px-4 py-2 text-center line-through text-gray-400">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr>
            <td class="border-t px-4 py-2 text-gray-600">Geração de recibos de atendimentos</td>
            <td class="border-t px-4 py-2 text-center line-through text-gray-400">✓</td>
            <td class="border-t px-4 py-2 text-center">✓</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border-t px-4 py-2 text-gray-600">Envio de recibos por e-mail automático</td>
            <td class="border-t px-4 py-2 text-center line-through text-gray-400">✓</td>
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
