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
      <HeaderUser title="Relatório Em Aberto" />

      <section class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
          <div>
            <select v-model="clientId" class="border px-3 py-2 rounded">
              <option value="">Todos os clientes</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <button @click="generateReport" class="btn">Aplicar</button>
        </div>
      </section>

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Cliente</th>
                <th class="px-4 py-2 font-medium text-gray-700">Serviço</th>
                <th class="px-4 py-2 font-medium text-gray-700">Sessões Pendentes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.client_id + r.service_id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ getClientName(r.client_id) }}</td>
                <td class="px-4 py-2">{{ getServiceName(r.service_id) }}</td>
                <td class="px-4 py-2">{{ r.remaining }}</td>
              </tr>
              <tr v-if="rows.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500">Nenhum registro</td>
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

export default {
  name: 'RelatorioEmAberto',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      userId: null,
      clients: [],
      services: [],
      appointments: [],
      clientId: '',
      rows: []
    }
  },
  methods: {
    getClientName(id) {
      const c = this.clients.find(cl => cl.id === id)
      return c ? c.name : ''
    },
    getServiceName(id) {
      const s = this.services.find(sv => sv.id === id)
      return s ? s.name : ''
    },
    computeRows() {
      const stats = {}
      this.appointments.forEach(a => {
        const key = `${a.client_id}-${a.service_id}`
        if (!stats[key]) stats[key] = { done: 0, pending: 0 }
        if (a.status === 'completed' || a.status === 'no_show') {
          stats[key].done += 1
        } else if (a.status !== 'canceled') {
          stats[key].pending += 1
        }
      })

      const rows = []
      this.services
        .filter(s => s.is_package && s.session_count)
        .forEach(svc => {
          this.clients.forEach(cl => {
            if (this.clientId && cl.id !== this.clientId) return
            const key = `${cl.id}-${svc.id}`
            const data = stats[key]
            if (!data) return
            const cycleRemaining = svc.session_count - (data.done % svc.session_count)
            const remaining = Math.max(cycleRemaining - data.pending, 0)
            if (remaining > 0) {
              rows.push({ client_id: cl.id, service_id: svc.id, remaining })
            }
          })
        })
      this.rows = rows
    },
    async fetchAppointments() {
      let query = supabase
        .from('appointments')
        .select('client_id, service_id, status')
        .eq('user_id', this.userId)
      if (this.clientId) query = query.eq('client_id', this.clientId)
      const { data } = await query
      this.appointments = data || []
    },
    async generateReport() {
      await this.fetchAppointments()
      this.computeRows()
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
      .eq('active', true)
    if (clientData) this.clients = clientData

    const { data: serviceData } = await supabase
      .from('services')
      .select()
      .eq('user_id', this.userId)
      .eq('active', true)
    if (serviceData) this.services = serviceData

    await this.generateReport()
  }
}
</script>

