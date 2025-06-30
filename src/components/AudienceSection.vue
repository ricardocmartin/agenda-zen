<template>
  <section class="py-20 px-8 bg-gray-50">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-12">Para quem é</h2>
      <div class="max-w-5xl mx-auto grid gap-8 md:grid-cols-4">
        <div v-for="a in audience" :key="a.title" class="space-y-3">
          <div class="text-4xl">{{ a.icon }}</div>
          <h3 class="font-semibold">{{ a.title }}</h3>
          <p class="text-sm text-gray-600">{{ a.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AudienceSection',
  data() {
    return {
      audience: [
        { icon: '🧑‍⚕️', title: 'Fisioterapeutas', desc: 'Organize sessões e pagamentos facilmente.' },
        { icon: '🧠', title: 'Psicólogos', desc: 'Gerencie consultas e lembretes automáticos.' },
        { icon: '💇‍♀️', title: 'Cabeleireiros', desc: 'Agendamentos rápidos pelo celular.' },
        { icon: '💅', title: 'Manicure', desc: 'Confirmações pelo WhatsApp em segundos.' }
      ]
    }
  }
}
</script>
