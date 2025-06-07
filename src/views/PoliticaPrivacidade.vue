<template>
  <Navbar />
  <section class="max-w-3xl mx-auto px-4 py-16 space-y-4">
    <h1 class="text-3xl font-bold text-center mb-4">Política de Privacidade</h1>
    <p>Esta política descreve como tratamos seus dados pessoais e garante a transparência sobre o uso das suas informações.</p>
    <p>Utilizamos seus dados apenas para prover nossos serviços de agendamento e nunca os compartilhamos com terceiros sem consentimento.</p>
    <p>Ao utilizar o Agenda Zen você concorda com esta política. Em caso de dúvidas entre em contato conosco.</p>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'PoliticaPrivacidade',
  components: { Navbar, Footer }
}
</script>
