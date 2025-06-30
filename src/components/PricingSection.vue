<template>
  <section class="py-20 px-8">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-12">Planos e preços</h2>
      <div class="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <div v-for="p in plans" :key="p.name" class="border rounded-lg p-6 shadow flex flex-col">
          <h3 class="text-xl font-semibold mb-2">{{ p.name }}</h3>
          <p class="text-3xl font-bold text-primary mb-4">{{ p.price }}</p>
          <ul class="text-sm text-gray-600 flex-1 space-y-1 mb-6 text-left">
            <li v-for="item in p.items" :key="item">- {{ item }}</li>
          </ul>
          <router-link to="/cadastro" class="btn mt-auto">Teste Grátis</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PricingSection',
  data() {
    return {
      plans: [
        { name: 'Grátis', price: 'R$0', items: ['Agenda online', 'Lembretes por e-mail'] },
        { name: 'Profissional', price: 'R$49/mês', items: ['WhatsApp automático', 'Pagamentos integrados'] },
        { name: 'Premium', price: 'R$79/mês', items: ['Tudo do Profissional', 'Suporte prioritário'] }
      ]
    }
  }
}
</script>
