<template>
  <Navbar />
  <section class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4 text-center" v-if="profile && service">
      <img src="/logo_pix.png" alt="Pix" class="mx-auto w-44 h-auto" />
      <img v-if="pixQrCode" :src="pixQrCode" alt="QR Code Pix" class="mx-auto w-40 h-auto" />
      <p class="font-semibold">Código de pagamento</p>
      <input type="text" v-model="pixCode" readonly class="w-full px-4 py-2 border rounded-md text-center" />
      <p class="font-semibold">Valor do pagamento</p>
      <p class="text-lg font-semibold">{{ formatPrice(service.price) }}</p>
      <p class="text-sm text-gray-600">Após o pagamento envie o comprovante para {{ profile.whatsapp }}</p>
    </div>
    <div v-else class="text-gray-500">Carregando...</div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { supabase } from '../supabase'
import { generatePixPayload } from '../utils/pix'

export default {
  name: 'PagamentoAgendamento',
  components: { Navbar, Footer },
  data() {
    return {
      profile: null,
      appointment: null,
      service: null,
      pixCode: '',
      pixQrCode: ''
    }
  },
  methods: {
    formatPrice(value) {
      if (value === null || value === undefined || value === '') return ''
      return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    },
    generatePix() {
      if (!this.profile || !this.service) return
      const payload = generatePixPayload({
        key: this.profile.pix_key,
        name: this.profile.business_name,
        amount: String(this.service.price)
      })
      this.pixCode = payload
      this.pixQrCode =
        'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' +
        encodeURIComponent(payload)
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const { data: appt } = await supabase
      .from('appointments')
      .select('*, service:services(price), profile:profiles(pix_key,business_name,whatsapp)')
      .eq('id', id)
      .single()
    if (appt) {
      this.appointment = appt
      this.service = appt.service
      this.profile = appt.profile
      this.generatePix()
    }
  }
}
</script>
