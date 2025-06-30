<template>
  <section class="py-20 px-8 bg-gray-50">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Funcionalidades</h2>
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(feature, index) in features" :key="index" class="bg-white rounded-lg p-6 shadow flex items-start space-x-3">
          <img src="/icons/check.svg" alt="" class="w-6 h-6 flex-shrink-0 mt-1" />
          <span class="text-gray-700 text-lg">{{ feature }}</span>
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
        'Cadastro e autenticação de usuários',
        'Gestão de clientes, serviços e salas',
        'Controle de agendamentos em lista, calendário ou semana',
        'Dashboard com estatísticas e gráficos',
        'Configuração de perfil público com link personalizado',
        'Geração de comprovantes de atendimento',
        'Lembretes automáticos para seus clientes',
        'Pagamentos via Pix de forma prática e segura'
      ]
    }
  }
}
</script>
