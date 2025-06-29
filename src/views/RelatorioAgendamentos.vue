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
      <HeaderUser title="Relatório de Agendamentos" />

      <section class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-sm" @click="setPeriodo('dia')">Dia</button>
            <button class="btn btn-sm" @click="setPeriodo('semana')">Semana</button>
            <button class="btn btn-sm" @click="setPeriodo('mes')">Mês</button>
          </div>
          <div class="flex space-x-2">
            <input type="date" v-model="filterStart" class="border px-3 py-2 rounded" />
            <input type="date" v-model="filterEnd" class="border px-3 py-2 rounded" />
          </div>
          <div v-if="canSeeClients">
            <select v-model="clientId" class="border px-3 py-2 rounded">
              <option value="">Todos os clientes</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div v-if="canSeeServices">
            <select v-model="serviceId" class="border px-3 py-2 rounded">
              <option value="">Todos os serviços</option>
              <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <button @click="fetchAppointments" class="btn">Aplicar</button>
        </div>
      </section>

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Data/Horário do Atendimento</th>
                <th class="px-4 py-2 font-medium text-gray-700">Paciente</th>
                <th class="px-4 py-2 font-medium text-gray-700">Serviço</th>
                <th class="px-4 py-2 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ formatDateBR(a.date) }} {{ addHoursToTime(a.time) }}</td>
                <td class="px-4 py-2">{{ getClientName(a.client_id) }}</td>
                <td class="px-4 py-2">{{ getServiceName(a.service_id) }}</td>
                <td class="px-4 py-2">{{ getStatusLabel(a) }}</td>
              </tr>
              <tr v-if="appointments.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">Nenhum agendamento</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import { supabase } from '../supabase'
import { formatDateBR } from '../utils/format'
import { addHoursToTime } from '../utils/datetime'
import { canView } from '../utils/permissions'

export default {
  name: 'RelatorioAgendamentos',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      userId: null,
      clients: [],
      services: [],
      appointments: [],
      filterStart: '',
      filterEnd: '',
      clientId: '',
      serviceId: '',
      canSeeClients: true,
      canSeeServices: true
    }
  },
  methods: {
    formatDateBR,
    addHoursToTime,
    setPeriodo(tipo) {
      const today = new Date()
      let start = new Date(today)
      let end = new Date(today)
      if (tipo === 'semana') {
        const day = today.getDay()
        const diff = day === 0 ? 6 : day - 1
        start.setDate(today.getDate() - diff)
        end = new Date(start)
        end.setDate(start.getDate() + 6)
      } else if (tipo === 'mes') {
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      }
      this.filterStart = start.toISOString().split('T')[0]
      this.filterEnd = end.toISOString().split('T')[0]
      this.fetchAppointments()
    },
    getClientName(id) {
      const c = this.clients.find(cl => cl.id === id)
      return c ? c.name : ''
    },
    getServiceName(id) {
      const s = this.services.find(sv => sv.id === id)
      return s ? s.name : ''
    },
    getStatusLabel(appt) {
      if (appt.status === 'completed') return 'atendimento realizado'
      if (appt.status === 'no_show') return 'faltou'
      return 'atendimento pendente'
    },
    async fetchAppointments() {
      if (!this.filterStart || !this.filterEnd) return
      let query = supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .gte('date', this.filterStart)
        .lte('date', this.filterEnd)
        .neq('status', 'canceled')
        .neq('status', 'deleted')

      if (this.canSeeClients && this.clientId) {
        query = query.eq('client_id', this.clientId)
      }
      if (this.canSeeServices && this.serviceId) {
        query = query.eq('service_id', this.serviceId)
      }

      const { data } = await query
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      this.appointments = data || []
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
      return
    }
    this.userId = user.id

    this.canSeeClients = await canView('Clientes')
    this.canSeeServices = await canView('Servicos')

    const { data: clientData } = await supabase
      .from('clients')
      .select()
      .eq('user_id', this.userId)
    if (clientData) this.clients = clientData

    const { data: serviceData } = await supabase
      .from('services')
      .select()
      .eq('user_id', this.userId)
      .eq('active', true)
    if (serviceData) this.services = serviceData

    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    this.filterStart = dateStr
    this.filterEnd = dateStr
    this.fetchAppointments()
  }
}
</script>
