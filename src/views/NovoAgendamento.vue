<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Novo Agendamento" />
      <section class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Adicionar Agendamento</h3>
        <form @submit.prevent="handleSaveAppointment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Data</label>
            <input type="date" v-model="form.date" class="w-full mt-1 px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Hora</label>
            <input type="time" step="60" v-model="form.time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="form.clientId" :disabled="fieldsDisabled" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option disabled value="">Selecione um cliente</option>
              <option v-for="client in activeClients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Serviço</label>
            <select v-model="form.serviceId" :disabled="fieldsDisabled" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option disabled value="">Selecione um serviço</option>
              <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sala de Reunião</label>
            <select v-model="form.roomId" :disabled="fieldsDisabled" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option disabled value="">Selecione uma sala</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Duração (minutos)</label>
            <input type="text" v-model="form.duration" :disabled="fieldsDisabled" class="w-full mt-1 px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea v-model="form.description" :disabled="fieldsDisabled" class="w-full mt-1 px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Pago?</label>
            <select v-model="form.paid" :disabled="fieldsDisabled" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="cancel" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="btn">Salvar</button>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import { supabase } from '../supabase'
import { sendAppointmentEmail } from '../utils/email'
import { formatDateBR } from '../utils/format'
import { addHoursToTime, addDays } from '../utils/datetime'

export default {
  name: 'NovoAgendamento',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      userId: null,
      form: {
        date: '',
        time: '',
        clientId: '',
        serviceId: '',
        roomId: '',
        duration: '',
        description: '',
        paid: false,
        status: 'confirmed'
      },
      clients: [],
      services: [],
      rooms: [],
      schedule: {
        startTime: '',
        endTime: '',
        weekDays: [],
        dailySchedule: null,
        cancelLimitHours: 0
      },
      fieldsDisabled: false,
      sidebarOpen: window.innerWidth >= 768
    }
  },
  methods: {
    formatDateBR,
    addHoursToTime,
    cancel() {
      this.fieldsDisabled = false
      this.$router.push('/agendamentos')
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
    async checkPendingSessionsForClient(clientId) {
      if (!clientId) return
      const { data: appts } = await supabase
        .from('appointments')
        .select('service_id')
        .eq('user_id', this.userId)
        .eq('client_id', clientId)

      const grouped = {}
      ;(appts || []).forEach(a => {
        grouped[a.service_id] = (grouped[a.service_id] || 0) + 1
      })

      for (const svc of this.services.filter(s => s.is_package && s.session_count)) {
        const cnt = grouped[svc.id] || 0
        const rem = cnt % svc.session_count
        if (rem > 0) {
          const confirmMsg = `O cliente possui sessões pendentes do serviço ${svc.name}. Deseja agendar para este serviço?`
          if (confirm(confirmMsg)) {
            this.form.serviceId = svc.id
            this.form.duration = svc.duration || ''
            const { data: last } = await supabase
              .from('appointments')
              .select('room_id, description, paid, status, duration')
              .eq('user_id', this.userId)
              .eq('client_id', clientId)
              .eq('service_id', svc.id)
              .order('date', { ascending: false })
              .order('time', { ascending: false })
              .limit(1)
              .maybeSingle()
            if (last) {
              this.form.roomId = last.room_id || ''
              this.form.description = last.description || ''
              this.form.paid = !!last.paid
              this.form.duration = last.duration || this.form.duration
              this.form.status = last.status || this.form.status
            }
            this.fieldsDisabled = true
            break
          }
        }
      }
    },
    async handleSaveAppointment() {
      if (!this.isSlotAllowed(this.form.date, this.form.time)) {
        alert('Horário fora do horário de trabalho configurado')
        return
      }
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          date: this.form.date,
          time: this.form.time,
          client_id: this.form.clientId,
          service_id: this.form.serviceId,
          room_id: this.form.roomId || null,
          duration: this.form.duration,
          description: this.form.description,
          paid: this.form.paid,
          user_id: this.userId,
          confirmed: true,
          from_site: false,
          status: this.form.status
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar agendamento: ' + error.message)
      } else {
        const serviceInfo = this.services.find(s => s.id === this.form.serviceId)
        if (serviceInfo && serviceInfo.is_package && serviceInfo.session_count && serviceInfo.session_count > 1) {
          const extra = []
          for (let i = 1; i < serviceInfo.session_count; i++) {
            extra.push({
              date: addDays(this.form.date, 7 * i),
              time: this.form.time,
              client_id: this.form.clientId,
              service_id: this.form.serviceId,
              room_id: this.form.roomId || null,
              duration: this.form.duration,
              description: this.form.description,
              paid: this.form.paid,
              user_id: this.userId,
              confirmed: true,
              from_site: false,
              status: this.form.status
            })
          }
          if (extra.length) {
            await supabase.from('appointments').insert(extra)
          }
        }
        const client = this.clients.find(c => c.id === this.form.clientId)
        const service = this.services.find(s => s.id === this.form.serviceId)
        const room = this.rooms.find(r => r.id === this.form.roomId)
        await sendAppointmentEmail({
          to: client?.email,
          subject: 'Agendamento de Consulta realizado',
          text:
            `Olá ${client?.name},\n\n` +
            `Seu agendamento para ${service?.name} foi confirmado para ${formatDateBR(this.form.date)} às ${this.form.time}.\n` +
            `${room ? `Sala: ${room.name}\n` : ''}` +
            `${room?.google_meet_link ? `Link: ${room.google_meet_link}\n` : ''}` +
            `\nE-mail enviado automaticamente.`
        }, false)
        this.$router.push('/agendamentos')
      }
    }
  },
  computed: {
    activeClients() {
      return this.clients.filter(c => c.active)
    }
  },
  watch: {
    async 'form.clientId'(val) {
      if (val) {
        await this.checkPendingSessionsForClient(val)
      }
    },
    'form.serviceId'(val) {
      const service = this.services.find(s => s.id === val)
      if (service) {
        if (this.form.duration === '') {
          this.form.duration = service.duration
        }
      }
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
      return
    }
    this.userId = user.id

    const { data: clientData } = await supabase
      .from('clients')
      .select()
      .eq('user_id', this.userId)

    if (clientData) {
      this.clients = clientData
    }

    const { data: serviceData } = await supabase
      .from('services')
      .select()
      .eq('user_id', this.userId)
      .eq('active', true)

    if (serviceData) {
      this.services = serviceData
    }

    const { data: roomsData } = await supabase
      .from('rooms')
      .select()
      .eq('user_id', this.userId)
      .eq('active', true)

    if (roomsData) {
      this.rooms = roomsData
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('start_time, end_time, week_days, daily_schedule, cancel_limit_hours')
      .eq('id', this.userId)
      .single()

    if (profileData) {
      this.schedule.startTime = profileData.start_time || ''
      this.schedule.endTime = profileData.end_time || ''
      this.schedule.weekDays = profileData.week_days ? profileData.week_days.split(',') : []
      this.schedule.dailySchedule = profileData.daily_schedule ? typeof profileData.daily_schedule === 'string' ? JSON.parse(profileData.daily_schedule) : profileData.daily_schedule : null
      this.schedule.cancelLimitHours = profileData.cancel_limit_hours || 0
    }
  }
}
</script>
