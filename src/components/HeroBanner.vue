<template>
    <section class="text-center py-20">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div>
            <h1 class="text-4xl font-bold text-blue-800 mb-4">Sua agenda digital simples e profissional</h1>
            <p class="text-gray-600 text-lg mb-6">Perfeita para psicólogos, terapeutas, dentistas, cabeleireiros e mais</p>
            <div class="space-x-4">
                <router-link to="/login" class="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100">Entrar</router-link>
                <router-link to="/cadastro" class="btn">Criar conta</router-link>
            </div>
            <div class="mt-6 text-2xl text-blue-600 font-semibold">
              Tempo restante: {{ formattedTime }}
            </div>
          </div>
          <div>
            <img src="/hero-illustration.png" alt="Ilustração profissional usando a plataforma" class="w-full h-auto mx-auto">
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroBanner',
    data() {
      return {
        timeLeft: 300,
        intervalId: null
      }
    },
    computed: {
      formattedTime() {
        const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, '0')
        const seconds = (this.timeLeft % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
      }
    },
    mounted() {
      this.intervalId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          clearInterval(this.intervalId)
        }
      }, 1000)
    },
    beforeUnmount() {
      clearInterval(this.intervalId)
    }
  }
  </script>