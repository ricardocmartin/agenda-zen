<template>
  <div class="min-h-screen flex bg-gray-100 items-center justify-center p-4">
    <div class="bg-white p-6 rounded-lg shadow w-full max-w-2xl">
      <div v-if="step === 1" class="space-y-4">
        <h2 class="text-xl font-semibold mb-4">Bem-vindo! Vamos começar pelo seu perfil.</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome Comercial</label>
          <input type="text" v-model="form.businessName" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            v-model="form.phone"
            @input="form.phone = phoneMask(form.phone)"
            class="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" v-model="form.email" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
      </div>

      <div v-else-if="step === 2" class="space-y-4">
        <h2 class="text-xl font-semibold mb-4">Horários de atendimento</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700">Horários por dia</label>
          <div class="mt-1 space-y-2">
            <div v-for="day in daysOfWeekOptions" :key="day.value" class="flex items-center space-x-2">
              <input type="checkbox" v-model="agenda.dailySchedule[day.value].enabled" />
              <span class="w-20">{{ day.label }}</span>
              <input type="time" step="60" v-model="agenda.dailySchedule[day.value].start" class="border rounded-md px-2 py-1" />
              <span>-</span>
              <input type="time" step="60" v-model="agenda.dailySchedule[day.value].end" class="border rounded-md px-2 py-1" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="step === 3" class="space-y-4">
        <h2 class="text-xl font-semibold mb-4">Cadastre seus serviços</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" v-model="serviceForm.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Duração</label>
          <input type="text" v-model="serviceForm.duration" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Valor</label>
          <input type="number" step="0.01" v-model="serviceForm.price" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div class="flex justify-end">
          <button @click="addService" class="btn">Adicionar</button>
        </div>
        <ul class="mt-4 space-y-1">
          <li v-for="(s, index) in services" :key="index" class="flex justify-between">
            <span>{{ s.name }} - {{ s.duration }}min - {{ formatPrice(s.price) }}</span>
            <button @click="removeService(index)" class="text-red-600 hover:underline">Remover</button>
          </li>
        </ul>
      </div>

      <div v-else-if="step === 4" class="space-y-4 text-center">
        <h2 class="text-2xl font-semibold">Pronto!</h2>
        <p>Seu cadastro inicial está concluído.</p>
        <p class="text-lg">Bem-vindo ao Agenda Zen!</p>
      </div>

      <div class="flex justify-between mt-6" v-if="step < 4">
        <button v-if="step > 1" @click="prev" class="px-4 py-2 border rounded">Voltar</button>
        <button @click="next" class="btn ml-auto">{{ step === 3 ? 'Finalizar' : 'Próximo' }}</button>
      </div>
      <div class="flex justify-center mt-6" v-else>
        <button @click="$router.push('/dashboard')" class="btn">Ir para o Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'
import { phoneMask } from '../utils/phone'
import { isValidEmail } from '../utils/format'

export default {
  name: 'Onboarding',
  data() {
    return {
      userId: null,
      step: 1,
      form: {
        businessName: '',
        phone: '',
        email: ''
      },
      agenda: {
        dailySchedule: {
          '0': { enabled: false, start: '', end: '' },
          '1': { enabled: false, start: '', end: '' },
          '2': { enabled: false, start: '', end: '' },
          '3': { enabled: false, start: '', end: '' },
          '4': { enabled: false, start: '', end: '' },
          '5': { enabled: false, start: '', end: '' },
          '6': { enabled: false, start: '', end: '' }
        }
      },
      serviceForm: {
        name: '',
        duration: '',
        price: ''
      },
      services: [],
      daysOfWeekOptions: [
        { value: '0', label: 'Domingo' },
        { value: '1', label: 'Segunda' },
        { value: '2', label: 'Terça' },
        { value: '3', label: 'Quarta' },
        { value: '4', label: 'Quinta' },
        { value: '5', label: 'Sexta' },
        { value: '6', label: 'Sábado' }
      ]
    }
  },
  methods: {
    phoneMask,
    generateSlug(name) {
      if (!name) return ''
      return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    },
    async next() {
      if (this.step === 1) {
        await this.saveProfile()
        this.step++
      } else if (this.step === 2) {
        await this.saveAgenda()
        this.step++
      } else if (this.step === 3) {
        await this.saveServices()
        await this.markOnboardingComplete()
        this.step++
      }
    },
    prev() {
      if (this.step > 1) this.step--
    },
    async saveProfile() {
      if (this.form.email && !isValidEmail(this.form.email)) {
        alert('E-mail inválido')
        return
      }
      const updates = {
        id: this.userId,
        business_name: this.form.businessName,
        slug: this.generateSlug(this.form.businessName),
        phone: this.form.phone,
        email: this.form.email
      }
      await supabase.from('profiles').upsert(updates, { onConflict: ['id'] })
    },
    async saveAgenda() {
      const summary = { start: null, end: null, days: [] }
      for (const [day, cfg] of Object.entries(this.agenda.dailySchedule)) {
        if (cfg.enabled && cfg.start && cfg.end) {
          summary.days.push(day)
          if (!summary.start || cfg.start < summary.start) summary.start = cfg.start
          if (!summary.end || cfg.end > summary.end) summary.end = cfg.end
        }
      }
      const updates = {
        id: this.userId,
        start_time: summary.start,
        end_time: summary.end,
        week_days: summary.days.join(','),
        daily_schedule: this.agenda.dailySchedule
      }
      await supabase.from('profiles').upsert(updates, { onConflict: ['id'] })
    },
    async saveServices() {
      for (const s of this.services) {
        await supabase.from('services').insert({
          name: s.name,
          duration: s.duration,
          price: parseFloat(s.price),
          user_id: this.userId
        })
      }
    },
    addService() {
      if (!this.serviceForm.name) return
      this.services.push({
        name: this.serviceForm.name,
        duration: this.serviceForm.duration,
        price: this.serviceForm.price
      })
      this.serviceForm = { name: '', duration: '', price: '' }
    },
    removeService(index) {
      this.services.splice(index, 1)
    },
    async markOnboardingComplete() {
      await supabase.from('profiles').upsert(
        { id: this.userId, onboarding_complete: true },
        { onConflict: ['id'] }
      )
    },
    formatPrice(value) {
      if (value === null || value === undefined || value === '') return ''
      return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
      return
    }
    this.userId = user.id
  }
}
</script>

