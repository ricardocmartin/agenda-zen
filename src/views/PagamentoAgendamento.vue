<template>
  <div class="flex flex-col min-h-screen">
    <section v-if="profile" class="bg-blue-600 text-white py-12">
      <div class="max-w-5xl mx-auto px-4 text-center space-y-4">
        <img :src="profile.image_url || '/hero-illustration.png'" alt="Banner" class="w-32 h-32 mx-auto rounded-full shadow-lg" />
        <h1 class="text-4xl font-bold">{{ profile.business_name }}</h1>
        <p v-if="profile.area_atuacao" class="text-sm">{{ profile.area_atuacao }}</p>
        <p class="text-lg">{{ profile.description }}</p>
      </div>
    </section>
    <section class="flex-1 flex items-center justify-center bg-gray-100 px-4">
      <div class="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4 text-center mt-8" v-if="profile && service">
        <img src="/logo_pix.png" alt="Pix" class="mx-auto w-44 h-auto" />
        <img v-if="pixQrCode" :src="pixQrCode" alt="QR Code Pix" class="mx-auto w-40 h-auto" />
        <p class="font-semibold">Código de pagamento</p>
        <input type="text" v-model="pixCode" readonly class="w-full px-4 py-2 border rounded-md text-center" />
        <p class="font-semibold">Valor do pagamento</p>
        <p class="text-lg font-semibold">{{ formatPrice(service.price) }}</p>
        <p class="text-sm text-gray-600">Após o pagamento envie o comprovante para {{ phoneMask(profile.whatsapp) }}</p>
      </div>
      <div v-else class="text-gray-500">Carregando...</div>
    </section>
    <ProfileFooter v-if="profile" :profile="profile" />
  </div>
</template>

<script>

import { supabase } from '../supabase'
import { generatePixPayload } from '../utils/pix'
import { phoneMask } from '../utils/phone'
import ProfileFooter from '../components/ProfileFooter.vue'

export default {
  name: 'PagamentoAgendamento',
  components: { ProfileFooter },
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
    phoneMask,
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
        'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
        encodeURIComponent(payload)
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const { data: appt, error: apptErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()
    if (apptErr) {
      console.error('Erro ao buscar agendamento:', apptErr.message)
      return
    }
    if (appt) {
      this.appointment = appt
      const { data: service } = await supabase
        .from('services')
        .select('price')
        .eq('id', appt.service_id)
        .single()
      this.service = service
      const { data: profile } = await supabase
        .from('profiles')
        .select('pix_key,business_name,whatsapp,image_url,area_atuacao,description')
        .eq('id', appt.user_id)
        .single()
      this.profile = profile
      this.generatePix()
    }
  }
}
</script>
