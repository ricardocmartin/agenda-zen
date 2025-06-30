<template>
  <section class="py-20 px-8">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-12">O que dizem nossos clientes</h2>
      <div class="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <div v-for="t in testimonials" :key="t.name" class="bg-white p-6 rounded-lg shadow">
          <img :src="t.photo" alt="Foto de {{ t.name }}" class="w-16 h-16 mx-auto rounded-full mb-4" />
          <p class="italic mb-2">{{ t.text }}</p>
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
        { photo: 'https://via.placeholder.com/80', text: 'O AgendaZen facilitou totalmente meus atendimentos.', name: 'Ana Lima', role: 'Fisioterapeuta' },
        { photo: 'https://via.placeholder.com/80', text: 'Uso todos os dias e recomendo para meus colegas.', name: 'Carlos Souza', role: 'Psicólogo' },
        { photo: 'https://via.placeholder.com/80', text: 'Meus clientes adoram receber lembretes automáticos.', name: 'Mariana Alves', role: 'Manicure' }
      ]
    }
  }
}
</script>
