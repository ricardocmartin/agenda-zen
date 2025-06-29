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
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div v-if="canSeeClients">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select v-model="clientId" class="w-full px-4 py-2 border rounded-md">
              <option value="">Todos</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div v-if="canSeeServices">
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
              <select v-model="groupBy" class="w-full px-4 py-2 border rounded-md">
                <option value="none">Nenhum</option>
                <option value="client">Cliente</option>
                <option value="service">Serviço</option>
                <option value="status">Status</option>
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
                <th class="px-4 py-2 font-medium text-gray-700">Cliente</th>
                <th class="px-4 py-2 font-medium text-gray-700">Serviço</th>
                <th class="px-4 py-2 font-medium text-gray-700">Valor</th>
                <th class="px-4 py-2 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in displayRows" :key="a.id || a.key" class="border-b last:border-b-0">
                <td class="px-4 py-2"><span v-if="groupBy === 'none'">{{ formatDateBR(a.date) }} {{ addHoursToTime(a.time) }}</span></td>
                <td class="px-4 py-2"><span v-if="groupBy === 'none' || groupBy === 'client'">{{ getClientName(a.client_id) }}</span></td>
                <td class="px-4 py-2"><span v-if="groupBy === 'none' || groupBy === 'service'">{{ getServiceName(a.service_id) }}</span></td>
                <td class="px-4 py-2">{{ formatPrice(groupBy === 'none' ? getServicePrice(a.service_id) : a.total) }}</td>
                <td class="px-4 py-2"><span v-if="groupBy === 'none' || groupBy === 'status'">{{ (groupBy === 'status' ? a.status : a.paid) ? 'Pago' : 'pagamento em aberto' }}</span></td>
              </tr>
              <tr v-if="displayRows.length === 0">
                <td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum registro</td>
              </tr>
              <tr>
                <td colspan="3" class="px-4 py-2 text-right font-semibold">Total</td>
                <td class="px-4 py-2 font-semibold">{{ formatPrice(totalAmount) }}</td>
                <td></td>
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
      groupBy: "none",
      filterEnd: '',
      paidFilter: 'all',
      canSeeClients: true,
      canSeeServices: true
    }
  },
  computed: {
    displayRows() {
      if (this.groupBy === "none") {
        return this.appointments
      }
      const groups = {}
      this.appointments.forEach(a => {
        const price = this.getServicePrice(a.service_id)
        let key = ""
        if (this.groupBy === "client") {
          key = `c${a.client_id}`
        } else if (this.groupBy === "service") {
          key = `s${a.service_id}`
        } else if (this.groupBy === "status") {
          key = a.paid ? "paid" : "open"
        }
        if (!groups[key]) {
          groups[key] = {
            key,
            client_id: this.groupBy === "client" ? a.client_id : null,
            service_id: this.groupBy === "service" ? a.service_id : null,
            status: this.groupBy === "status" ? a.paid : null,
            total: 0
          }
        }
        groups[key].total += price
      })
      return Object.values(groups)
    },
    totalAmount() {
      if (this.groupBy === "none") {
        return this.appointments.reduce((sum, a) => sum + this.getServicePrice(a.service_id), 0)
      }
      return this.displayRows.reduce((sum, g) => sum + g.total, 0)
    }
  },
  methods: {
    formatDateBR,
    addHoursToTime,
    formatPrice(value) {
      return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    getClientName(id) {
      const c = this.clients.find(cl => cl.id === id)
      return c ? c.name : ''
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

      if (this.canSeeClients && this.clientId) query = query.eq('client_id', this.clientId)
      if (this.canSeeServices && this.serviceId) query = query.eq('service_id', this.serviceId)
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

    this.canSeeClients = await canView('Clientes')
    this.canSeeServices = await canView('Servicos')

    const { data: clients } = await supabase.from('clients').select().eq('user_id', this.userId)
    if (clients) this.clients = clients

    const { data: services } = await supabase.from('services').select().eq('user_id', this.userId)
      .eq('active', true)
    if (services) this.services = services

    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    this.filterStart = firstDay.toISOString().split('T')[0]
    this.filterEnd = today.toISOString().split('T')[0]
    this.fetchAppointments()
  }
}
</script>
