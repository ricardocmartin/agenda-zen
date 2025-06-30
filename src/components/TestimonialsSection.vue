<template>
  <section class="py-20 px-8 bg-gray-50">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-12">O que dizem nossos clientes</h2>
      <div class="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <div
          v-for="t in testimonials"
          :key="t.name"
          class="bg-white p-6 rounded-lg shadow flex flex-col items-center text-center"
        >
          <svg class="w-6 h-6 text-primary mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.17 6.17A5 5 0 0 0 4 10v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H6v-1a3 3 0 0 1 3-3zM15.17 6.17A5 5 0 0 0 12 10v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2v-1a3 3 0 0 1 3-3z" />
          </svg>
          <img :src="t.photo" alt="Foto de {{ t.name }}" class="w-16 h-16 rounded-full mb-4" />
          <p class="italic mb-2 text-gray-700">{{ t.text }}</p>
          <p class="font-semibold text-primary">{{ t.name }}</p>
          <p class="text-sm text-gray-500">{{ t.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection',
  data() {
    return {
      testimonials: [
        { photo: 'https://source.unsplash.com/80x80/?woman,1', text: 'O AgendaZen facilitou totalmente meus atendimentos.', name: 'Ana Lima', role: 'Fisioterapeuta' },
        { photo: 'https://source.unsplash.com/80x80/?man,2', text: 'Uso todos os dias e recomendo para meus colegas.', name: 'Carlos Souza', role: 'Psicólogo' },
        { photo: 'https://source.unsplash.com/80x80/?woman,3', text: 'Meus clientes adoram receber lembretes automáticos.', name: 'Mariana Alves', role: 'Manicure' }
      ]
    }
  }
}
</script>
