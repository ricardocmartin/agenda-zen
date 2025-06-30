<template>
  <section class="py-20 px-8 bg-gray-50">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Funcionalidades</h2>
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(feature, index) in features" :key="index" class="bg-white rounded-lg p-6 shadow text-center space-y-4">
          <img :src="feature.icon" alt="" class="w-10 h-10 mx-auto" />
          <span class="block text-gray-700 text-lg font-medium">{{ feature.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection',
  data() {
    return {
      features: [
        { icon: '/icons/whatsapp.svg', text: 'Confirmação por WhatsApp' },
        { icon: '/icons/bell.svg', text: 'Evite faltas e atrasos' },
        { icon: '/icons/pix.svg', text: 'Pagamento integrado' },
        { icon: '/icons/calendar.svg', text: 'Sistema simples de usar' }
      ]
    }
  }
}
</script>
