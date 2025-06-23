<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-8 space-y-6">
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

      <section v-if="activeTab === 'cartao'" class="space-y-6 max-w-3xl">
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

      <section v-if="activeTab === 'pix'" class="space-y-6 max-w-3xl">
        <div class="text-center space-y-4">
          <!-- Increase the Pix logo size by about 10% -->
          <img src="/logo_pix.png" alt="Logo Pix" class="mx-auto w-[17.6rem] h-auto" />
          <img v-if="pixQrCode" :src="pixQrCode" alt="QR Code Pix" class="mx-auto w-40 h-auto" />
          <p class="font-semibold">Código de pagamento</p>
          <p>Copie e cole o código abaixo no app da sua instituição financeira para finalizar a compra.</p>
          <input type="text" v-model="pixCode" readonly class="w-full px-4 py-2 border rounded-md text-center" />
          <p class="font-semibold">Valor do pagamento</p>
          <p class="text-lg font-semibold">R$ {{ pixAmount.replace('.', ',') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import QRCode from 'qrcode'
import { generatePixPayload } from '../utils/pix.js'

export default {
  name: 'PagamentoPlus',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      activeTab: 'pix',
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
      // Valor do pagamento será definido com base no plano selecionado
      pixAmount: '167.97',
      pixCode: '',
      pixQrCode: ''
    }
  },
  mounted() {
    // Obtém o valor do plano via query string caso exista
    const amount = this.$route.query.amount
    if (amount) {
      this.pixAmount = amount
    }
    this.generatePix()
  },
  methods: {
    generatePix() {
      const payload = generatePixPayload({
        key: '37775989840',
        name: 'Jeferson Carlos A de Paula',
        amount: this.pixAmount
      })
      this.pixCode = payload
      QRCode.toDataURL(payload).then(url => {
        this.pixQrCode = url
      })
    }
  }
}
</script>
