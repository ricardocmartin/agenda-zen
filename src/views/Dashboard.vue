<template>
  <div class="min-h-screen flex bg-gray-50 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="flex-1 p-4 md:p-8 space-y-8">
      <div class="md:hidden flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <!-- simple hamburger icon -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <HeaderUser title="Dashboard" />

      <!-- Indicadores -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <p class="text-sm text-gray-500">Agendamentos na semana</p>
          <p class="text-2xl font-bold">{{ stats.week }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <p class="text-sm text-gray-500">Agendamentos no mês</p>
          <p class="text-2xl font-bold">{{ stats.month }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <p class="text-sm text-gray-500">Clientes cadastrados</p>
          <p class="text-2xl font-bold">{{ stats.clients }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <p class="text-sm text-gray-500">Novos clientes no mês</p>
          <p class="text-2xl font-bold">{{ stats.newClients }}</p>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div class="md:col-span-8">
          <!-- Próximos agendamentos -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Próximos agendamentos</h3>
            <button @click="showAppointmentModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Novo Agendamento</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="ap in upcomingAppointments" :key="ap.id" class="p-4 bg-white rounded-lg shadow">
              <strong>{{ ap.date }} {{ ap.time }}</strong>
              <div>{{ getClientName(ap.client_id) }}</div>
              <div class="text-sm text-gray-600">{{ ap.description }}</div>
            </div>
            <p v-if="upcomingAppointments.length === 0" class="text-gray-500 col-span-full">Nenhum agendamento</p>
          </div>
        </div>
        <div class="md:col-span-4 space-y-4">
          <!-- Cadastro rápido de clientes -->
          <button @click="showClientModal = true" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Novo Cliente</button>

          <div class="bg-white p-4 rounded-lg shadow">
            <h4 class="font-medium mb-2">Clientes com mais agendamentos</h4>
            <ul class="space-y-1">
              <li v-for="c in topClients" :key="c.id" class="flex justify-between">
                <span>{{ c.name }}</span>
                <span>{{ c.count }}</span>
              </li>
              <li v-if="topClients.length === 0" class="text-gray-500 text-sm">Nenhum dado</li>
            </ul>
          </div>
        </div>
      </section>

      <Modal v-if="showClientModal" @close="showClientModal = false">
        <h3 class="text-lg font-semibold mb-4">Adicionar Cliente</h3>
        <form @submit.prevent="handleAddClient" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="clientForm.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" v-model="clientForm.email" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="text" v-model="clientForm.phone" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showClientModal = false" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Salvar</button>
          </div>
        </form>
      </Modal>

      <Modal v-if="showAppointmentModal" @close="showAppointmentModal = false">
        <h3 class="text-lg font-semibold mb-4">Adicionar Agendamento</h3>
        <form @submit.prevent="handleAddAppointment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Data</label>
            <input type="date" v-model="appointmentForm.date" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Hora</label>
            <input type="time" v-model="appointmentForm.time" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="appointmentForm.clientId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione um cliente</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea v-model="appointmentForm.description" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showAppointmentModal = false" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
          </div>
        </form>
      </Modal>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import Modal from '../components/Modal.vue'
import { supabase } from '../supabase'

export default {
  name: 'Dashboard',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      stats: {
        week: 0,
        month: 0,
        clients: 0,
        newClients: 0
      },
      upcomingAppointments: [],
      clients: [],
      topClients: [],
      sidebarOpen: false,
      showClientModal: false,
      showAppointmentModal: false,
      clientForm: {
        name: '',
        email: '',
        phone: ''
      },
      appointmentForm: {
        date: '',
        time: '',
        clientId: '',
        description: ''
      }
    }
  },
  methods: {
    async fetchStats() {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - dayOfWeek)
      startOfWeek.setHours(0, 0, 0, 0)
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + (6 - dayOfWeek))
      endOfWeek.setHours(23, 59, 59, 999)

      const startWeek = startOfWeek.toISOString().split('T')[0]
      const endWeek = endOfWeek.toISOString().split('T')[0]

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)
      const startMonth = startOfMonth.toISOString().split('T')[0]
      const endMonth = endOfMonth.toISOString().split('T')[0]

      const { data: weekData } = await supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .gte('date', startWeek)
        .lte('date', endWeek)

      this.stats.week = weekData ? weekData.length : 0

      const { data: monthData } = await supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .gte('date', startMonth)
        .lte('date', endMonth)

      this.stats.month = monthData ? monthData.length : 0

      const { data: clientData } = await supabase
        .from('clients')
        .select()
        .eq('user_id', this.userId)

      if (clientData) {
        this.stats.clients = clientData.length
        this.clients = clientData
        this.stats.newClients = clientData.filter(c => {
          const created = new Date(c.created_at)
          return created >= startOfMonth && created <= endOfMonth
        }).length
      }
      await this.fetchTopClients()
    },
  async fetchUpcomingAppointments() {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(5)

      this.upcomingAppointments = data || []
    },
    async fetchTopClients() {
      const { data } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('user_id', this.userId)

      const counts = {}
      if (data) {
        data.forEach(a => {
          counts[a.client_id] = (counts[a.client_id] || 0) + 1
        })
      }
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
      this.topClients = sorted.map(([id, count]) => ({
        id,
        count,
        name: this.getClientName(id)
      }))
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.id === clientId)
      return client ? client.name : ''
    },
    async handleAddClient() {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: this.clientForm.name,
          email: this.clientForm.email,
          phone: this.clientForm.phone,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar cliente: ' + error.message)
      } else {
        this.clients.push(data)
        this.clientForm = { name: '', email: '', phone: '' }
        this.stats.clients += 1
        const now = new Date(data.created_at)
        const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        endMonth.setHours(23, 59, 59, 999)
        if (now >= startMonth && now <= endMonth) {
          this.stats.newClients += 1
        }
        await this.fetchTopClients()
        alert('Cliente cadastrado!')
      }
    },
    async handleAddAppointment() {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          date: this.appointmentForm.date,
          time: this.appointmentForm.time,
          client_id: this.appointmentForm.clientId,
          description: this.appointmentForm.description,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar agendamento: ' + error.message)
      } else {
        this.upcomingAppointments.push(data)
        this.showAppointmentModal = false
        this.appointmentForm = { date: '', time: '', clientId: '', description: '' }
        this.stats.week += 1
        this.stats.month += 1
        await this.fetchTopClients()
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

    await this.fetchStats()
    await this.fetchUpcomingAppointments()
  }
}
</script>
