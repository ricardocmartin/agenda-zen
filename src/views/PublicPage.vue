<template>
  <div class="min-h-screen flex flex-col bg-white">
    <section v-if="profile" class="flex-1">
      <div class="bg-blue-600 text-white py-12">
        <div class="max-w-5xl mx-auto px-4 text-center space-y-4">
          <img :src="profile.image_url || '/hero-illustration.png'" alt="Banner" class="w-32 h-32 mx-auto rounded-full shadow-lg" />
          <h1 class="text-4xl font-bold">{{ profile.business_name }}</h1>
          <p v-if="profile.area_atuacao" class="text-sm">{{ profile.area_atuacao }}</p>
          <p class="text-lg">{{ profile.description }}</p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-12 space-y-16">
        <div>
          <h2 class="text-2xl font-semibold text-blue-600 mb-4">Serviços</h2>
          <ul v-if="services.length" class="grid gap-6 md:grid-cols-2">
            <li v-for="service in services" :key="service.id" class="p-4 bg-gray-50 border rounded-lg shadow">
              <h3 class="text-lg font-medium text-blue-700">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
              <p class="text-sm text-gray-500 mt-1">Duração: {{ service.duration }} minutos</p>
              <p class="text-sm text-gray-500">Valor: {{ formatPrice(service.price) }}</p>
              <button class="btn mt-2" @click="openModal(service)">Agendar</button>
            </li>
          </ul>
          <p v-else class="text-gray-500">Nenhum serviço cadastrado.</p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-blue-600 mb-4">Contato</h2>
          <ul class="space-y-1 text-gray-700">
            <li><strong>Telefone:</strong> {{ profile.phone }}</li>
            <li><strong>WhatsApp:</strong> {{ profile.whatsapp }}</li>
            <li><strong>Email:</strong> {{ profile.email }}</li>
            <li><strong>Endereço:</strong> {{ profile.address }}</li>
          </ul>
        </div>
      </div>
    </section>

    <a
      v-if="profile && profile.whatsapp"
      :href="whatsappLink"
      target="_blank"
      rel="noopener"
      class="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
    >
      <img src="/icons/whatsapp.svg" alt="WhatsApp" class="w-6 h-6" />
    </a>

    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
      <p>Carregando perfil...</p>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <h3 class="text-lg font-semibold mb-4">Agendar {{ selectedService?.name }}</h3>
      <form @submit.prevent="handleSchedule" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" v-model="form.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" v-model="form.email" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            v-model="form.phone"
            @input="form.phone = phoneMask(form.phone)"
            class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Data</label>
          <input type="date" v-model="form.date" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Hora</label>
          <input type="time" step="60" v-model="form.time" class="w-full mt-1 px-4 py-2 border rounded-md" />
          <p v-if="slotError" class="mt-1 text-sm text-red-600">{{ slotError }}</p>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
          <button type="submit" class="btn">Agendar</button>
        </div>
      </form>
    </Modal>

    <footer v-if="profile" class="bg-gray-100 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center space-y-2">
        <div class="space-x-4 text-blue-600">
          <a v-if="profile.instagram" :href="profile.instagram" class="hover:underline">Instagram</a>
          <a v-if="profile.facebook" :href="profile.facebook" class="hover:underline">Facebook</a>
          <a v-if="profile.youtube" :href="profile.youtube" class="hover:underline">YouTube</a>
          <a v-if="profile.x" :href="profile.x" class="hover:underline">X (Twitter)</a>
        </div>
        <p class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} {{ profile.business_name }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { supabase } from '../supabase'
import Modal from '../components/Modal.vue'
import { phoneMask } from '../utils/phone'
import { isValidEmail } from '../utils/format'

export default {
  name: 'PublicPage',
  components: { Modal },
  data() {
    return {
      profile: null,
      services: [],
      showModal: false,
      selectedService: null,
      form: { name: '', email: '', phone: '', date: '', time: '' },
      slotError: '',
      schedule: {
        startTime: '',
        endTime: '',
        weekDays: [],
        dailySchedule: null
      }
    }
  },
  computed: {
    whatsappLink() {
      const raw = this.profile?.whatsapp || ''
      const digits = raw.replace(/\D/g, '')
      return `https://wa.me/${digits}`
    }
  },
  watch: {
    'form.date'() {
      this.slotError = ''
    },
    'form.time'() {
      this.slotError = ''
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
    openModal(service) {
      this.selectedService = service
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedService = null
      this.form = { name: '', email: '', phone: '', date: '', time: '' }
      this.slotError = ''
    },
    isSlotAllowed(dateStr, timeStr) {
      if (!dateStr || !timeStr) return false
      const day = new Date(dateStr + 'T12:00:00').getDay().toString()
      if (this.schedule.dailySchedule) {
        const cfg = this.schedule.dailySchedule[day]
        if (!cfg || !cfg.enabled || !cfg.start || !cfg.end) return false
        return timeStr >= cfg.start && timeStr <= cfg.end
      }
      if (this.schedule.weekDays.length) {
        if (!this.schedule.weekDays.includes(day)) return false
        if (this.schedule.startTime && timeStr < this.schedule.startTime) return false
        if (this.schedule.endTime && timeStr > this.schedule.endTime) return false
      }
      return true
    },
   async handleSchedule() {
      if (this.form.email && !isValidEmail(this.form.email)) {
        alert('E-mail inválido')
        return
      }
      if (!this.isSlotAllowed(this.form.date, this.form.time)) {
        this.slotError = 'Este horário não está disponível. Que tal agendar para 1 hora mais tarde ou mais cedo?'
        return
      }
      const { data: exists } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', this.profile.id)
        .eq('date', this.form.date)
        .eq('time', this.form.time)
        .limit(1)
      if (exists && exists.length) {
        this.slotError = 'Este horário não está disponível. Que tal agendar para 1 hora mais tarde ou mais cedo?'
        return
      }

      let clientId
      let existingClient = null

      // Busca cliente pelo e-mail informado
      if (this.form.email) {
        const { data } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', this.profile.id)
          .eq('email', this.form.email)
          .maybeSingle()
        if (data) existingClient = data
      }

      // Caso não tenha e-mail, tenta localizar pelo telefone
      if (!existingClient && this.form.phone) {
        const { data } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', this.profile.id)
          .eq('phone', this.form.phone)
          .maybeSingle()
        if (data) existingClient = data
      }

      if (existingClient) {
        clientId = existingClient.id
        const { error: updateErr } = await supabase
          .from('clients')
          .update({
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone
          })
          .eq('id', clientId)
        if (updateErr) {
          alert('Erro ao atualizar cliente: ' + updateErr.message)
          return
        }
      } else {
        const { data: newClient, error: clientErr } = await supabase
          .from('clients')
          .insert({
            user_id: this.profile.id,
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone
          })
          .select()
          .single()
        if (clientErr) {
          alert('Erro ao cadastrar cliente: ' + clientErr.message)
          return
        }
        clientId = newClient.id
      }

      const { data: appt, error } = await supabase
        .from('appointments')
        .insert({
          user_id: this.profile.id,
          client_id: clientId,
          service_id: this.selectedService.id,
          date: this.form.date,
          time: this.form.time,
          duration: this.selectedService.duration,
          confirmed: false,
          from_site: true
        })
        .select()
        .single()
      if (error) {
        alert('Erro ao agendar: ' + error.message)
        return
      }
      this.closeModal()
      this.$router.push({ name: 'PagamentoAgendamento', params: { id: appt.id } })
    }
  },
  async mounted() {
    const slug = this.$route.params.slug

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (data) {
      this.profile = data
      const { data: servicesData } = await supabase
        .from('services')
        .select()
        .eq('user_id', data.id)

      this.services = servicesData || []
      this.schedule.startTime = data.start_time || ''
      this.schedule.endTime = data.end_time || ''
      this.schedule.weekDays = data.week_days ? data.week_days.split(',') : []
      this.schedule.dailySchedule = data.daily_schedule
        ? typeof data.daily_schedule === 'string'
          ? JSON.parse(data.daily_schedule)
          : data.daily_schedule
        : null
    }
  }
}
</script>
