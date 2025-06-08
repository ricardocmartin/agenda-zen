<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8 space-y-6">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Pagamento" />

      <nav class="mb-6 space-x-2">
        <button
          @click="activeTab = 'cartao'"
          :class="activeTab === 'cartao' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-l"
        >Cartão de Crédito</button>
        <button
          @click="activeTab = 'pix'"
          :class="activeTab === 'pix' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-r"
        >Pix</button>
      </nav>

      <section v-if="activeTab === 'cartao'" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md">
        <div class="flex justify-center space-x-2 mb-4">
          <img src="/icons/visa.svg" alt="Visa" class="h-8" />
          <img src="/icons/mastercard.svg" alt="Mastercard" class="h-8" />
          <img src="/icons/amex.svg" alt="American Express" class="h-8" />
          <img src="/icons/elo.svg" alt="Elo" class="h-8" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome (igual no cartão)</label>
          <input type="text" v-model="card.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Número do cartão</label>
          <input type="text" v-model="card.number" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Validade (MM/AA)</label>
            <input type="text" v-model="card.expiry" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Código de Segurança (CVV)</label>
            <input type="text" v-model="card.cvv" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
          <input type="text" v-model="card.document" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>

        <div class="space-y-4 mt-4">
          <h3 class="text-md font-semibold">Endereço de cobrança</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">CEP</label>
            <input type="text" v-model="billing.cep" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Rua</label>
            <input type="text" v-model="billing.street" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Número</label>
              <input type="text" v-model="billing.number" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Complemento</label>
              <input type="text" v-model="billing.complement" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bairro</label>
            <input type="text" v-model="billing.neighborhood" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" v-model="billing.city" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <input type="text" v-model="billing.state" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        <div class="text-right mt-4">
          <button class="btn">Pagar</button>
        </div>
      </section>

      <section v-if="activeTab === 'pix'" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md">
        <div class="text-center space-y-4">
          <img src="/icons/pix.svg" alt="QR Code Pix" class="w-32 h-32 mx-auto" />
          <input type="text" v-model="pixCode" readonly class="w-full px-4 py-2 border rounded-md text-center" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'

export default {
  name: 'PagamentoPlus',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: true,
      activeTab: 'cartao',
      card: {
        name: '',
        number: '',
        expiry: '',
        cvv: '',
        document: ''
      },
      billing: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      },
      pixCode: '000201010212...'
    }
  }
}
</script>
