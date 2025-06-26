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
      <HeaderUser title="Relatório de Recebimento" />

      <section class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select v-model="clientId" class="w-full px-4 py-2 border rounded-md">
              <option value="">Todos</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
            <select v-model="serviceId" class="w-full px-4 py-2 border rounded-md">
              <option value="">Todos</option>
              <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">De</label>
            <input type="date" v-model="filterStart" class="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Até</label>
            <input type="date" v-model="filterEnd" class="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Agendamentos</label>
            <select v-model="paidFilter" class="w-full px-4 py-2 border rounded-md">
              <option value="all">Todos</option>
              <option value="paid">Pagos</option>
              <option value="open">Em aberto</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="fetchAppointments" class="btn">Aplicar</button>
        </div>
      </section>

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Data/Horário do Atendimento</th>
                <th class="px-4 py-2 font-medium text-gray-700">Serviço</th>
                <th class="px-4 py-2 font-medium text-gray-700">Valor</th>
                <th class="px-4 py-2 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ formatDateBR(a.date) }} {{ addHoursToTime(a.time) }}</td>
                <td class="px-4 py-2">{{ getServiceName(a.service_id) }}</td>
                <td class="px-4 py-2">{{ formatPrice(getServicePrice(a.service_id)) }}</td>
                <td class="px-4 py-2">{{ a.paid ? 'Pago' : 'pagamento em aberto' }}</td>
              </tr>
              <tr v-if="appointments.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">Nenhum registro</td>
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

export default {
  name: 'Recebimento',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      userId: null,
      clients: [],
      services: [],
      appointments: [],
      clientId: '',
      serviceId: '',
      filterStart: '',
      filterEnd: '',
      paidFilter: 'all'
    }
  },
  methods: {
    formatDateBR,
    addHoursToTime,
    formatPrice(value) {
      return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    getServiceName(id) {
      const s = this.services.find(sv => sv.id === id)
      return s ? s.name : ''
    },
    getServicePrice(id) {
      const s = this.services.find(sv => sv.id === id)
      return s ? s.price || 0 : 0
    },
    async fetchAppointments() {
      if (!this.filterStart || !this.filterEnd) return
      let query = supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .gte('date', this.filterStart)
        .lte('date', this.filterEnd)

      if (this.clientId) query = query.eq('client_id', this.clientId)
      if (this.serviceId) query = query.eq('service_id', this.serviceId)
      if (this.paidFilter === 'paid') query = query.eq('paid', true)
      else if (this.paidFilter === 'open') query = query.eq('paid', false)

      const { data } = await query.order('date', { ascending: true }).order('time', { ascending: true })
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

    const { data: clients } = await supabase.from('clients').select().eq('user_id', this.userId)
    if (clients) this.clients = clients

    const { data: services } = await supabase.from('services').select().eq('user_id', this.userId)
    if (services) this.services = services

    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    this.filterStart = firstDay.toISOString().split('T')[0]
    this.filterEnd = today.toISOString().split('T')[0]
    this.fetchAppointments()
  }
}
</script>
