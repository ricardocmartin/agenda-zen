<template>
  <Navbar />
  <section class="max-w-3xl mx-auto px-4 py-16 space-y-4">
    <h1 class="text-3xl font-bold text-center mb-4">Termos de Uso</h1>
    <p>Estes termos definem as regras para utilização da plataforma Agenda Zen. Ao criar uma conta você concorda em segui-los.</p>
    <p>O serviço deve ser utilizado apenas para atividades lícitas e em conformidade com a legislação vigente. Contas que violem estas condições poderão ser suspensas.</p>
    <p>Podemos atualizar estes termos periodicamente. Avisaremos sobre mudanças importantes diretamente no site.</p>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'TermosDeUso',
  components: { Navbar, Footer }
}
</script>
