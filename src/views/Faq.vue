<template>
  <Navbar />
  <section class="max-w-3xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h1>
    <div class="space-y-6">
      <div v-for="(faq, index) in faqs" :key="index" class="bg-white p-6 rounded-lg shadow">
        <h2 class="font-semibold text-blue-600 mb-2">{{ faq.question }}</h2>
        <p class="text-gray-700">{{ faq.answer }}</p>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Faq',
  components: { Navbar, Footer },
  data() {
    return {
      faqs: [
        {
          question: 'Como me cadastro?',
          answer: 'Clique em "Cadastre-se" no menu e preencha o formulário.'
        },
        {
          question: 'Posso cancelar a qualquer momento?',
          answer: 'Sim, você pode cancelar seu plano a hora que quiser sem taxas adicionais.'
        },
        {
          question: 'Como entro em contato com o suporte?',
          answer: 'Utilize a página de contato para nos enviar sua mensagem.'
        }
      ]
    }
  }
}
</script>
