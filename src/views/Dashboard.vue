<template>
  <div class="min-h-screen flex bg-gray-50 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="flex-1 p-4 md:p-8 space-y-8">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
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

      <section class="bg-white p-6 rounded-lg shadow-lg h-64">
        <h3 class="text-lg font-medium mb-4">Agendamentos na semana</h3>
        <canvas ref="weekChartCanvas" class="w-full h-full"></canvas>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div class="md:col-span-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Agenda da Semana</h3>
            <button @click="openAppointmentModal()" class="btn">Novo Agendamento</button>
          </div>
          <WeekView
            :appointments="upcomingAppointments"
            :getClientName="getClientName"
            @select="openDetails"
          />
        </div>
        <div class="md:col-span-4 space-y-4">
          <!-- Cadastro rápido de clientes -->
          <button @click="openClientModal" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Novo Cliente</button>

          <div class="bg-white p-4 rounded-lg shadow">
            <h4 class="font-medium mb-2">Clientes com mais agendamentos</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 font-medium text-gray-700">Cliente</th>
                    <th class="px-4 py-2 font-medium text-gray-700 text-right">Agendamentos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in topClients" :key="c.id" class="border-b last:border-b-0">
                    <td class="px-4 py-2">{{ c.name }}</td>
                    <td class="px-4 py-2 text-right">{{ c.count }}</td>
                  </tr>
                  <tr v-if="topClients.length === 0">
                    <td colspan="2" class="px-4 py-6 text-center text-gray-500">Nenhum dado</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            <label class="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              v-model="clientForm.cpf"
              @input="clientForm.cpf = cpfMask(clientForm.cpf)"
              class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Data de nascimento</label>
            <input type="date" v-model="clientForm.birthdate" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" v-model="clientForm.email" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              v-model="clientForm.phone"
              @input="clientForm.phone = phoneMask(clientForm.phone)"
              class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              v-model="clientForm.cep"
              @input="clientForm.cep = cepMask(clientForm.cep)"
              class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" v-model="clientForm.street" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Número</label>
            <input type="text" v-model="clientForm.number" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Complemento</label>
            <input type="text" v-model="clientForm.complement" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bairro</label>
            <input type="text" v-model="clientForm.neighborhood" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <select v-model="clientForm.stateId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option v-for="s in states" :key="s.id" :value="s.id">{{ s.nome }} ({{ s.sigla }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cidade</label>
            <select v-model="clientForm.cityId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.nome }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showClientModal = false" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Salvar</button>
          </div>
        </form>
      </Modal>

      <Modal v-if="showAppointmentModal" @close="closeAppointmentModal">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingId ? 'Editar Agendamento' : 'Adicionar Agendamento' }}
        </h3>
        <form @submit.prevent="handleAddAppointment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Data</label>
            <input type="date" v-model="appointmentForm.date" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Hora</label>
            <input type="time" step="60" v-model="appointmentForm.time" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="appointmentForm.clientId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione um cliente</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Serviço</label>
            <select v-model="appointmentForm.serviceId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione um serviço</option>
              <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Duração (minutos)</label>
            <input type="text" v-model="appointmentForm.duration" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea v-model="appointmentForm.description" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeAppointmentModal" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="btn">Salvar</button>
          </div>
        </form>
      </Modal>

      <Modal v-if="showDetailsModal" @close="closeDetails">
        <AppointmentDetails
          :appointment="selectedAppointment"
          :getClientName="getClientName"
          :getServiceName="getServiceName"
          :getRoomName="getRoomName"
          :getRoomLink="getRoomLink"
          @close="closeDetails"
        >
          <template #actions>
            <div class="mt-4">
              <h4 class="font-medium mb-2">Ações de atendimento</h4>
              <div class="flex flex-wrap justify-center gap-2">
                <button @click="sendConfirmationWhatsApp" class="btn btn-success">Enviar confirmação</button>
                <button @click="cancelAppointment" class="btn btn-warning">Desmarcou</button>
                <button @click="markNoShow" class="btn btn-secondary">Faltou</button>
                <button @click="startAppointment" class="btn btn-primary">Iniciar atendimento</button>
              </div>
            </div>

            <div class="mt-4">
              <h4 class="font-medium mb-2">Ações de cadastro</h4>
              <div class="flex flex-wrap justify-center gap-2">
                <button @click="editFromDetails" class="btn">Editar</button>
                <button @click="handleDeleteAppointment(selectedAppointment.id)" class="btn btn-danger">Excluir</button>
                <button @click="closeDetails" class="px-4 py-2 rounded border">Fechar</button>
              </div>
            </div>
          </template>
        </AppointmentDetails>
      </Modal>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import Modal from '../components/Modal.vue'
import WeekView from '../components/WeekView.vue'
import AppointmentDetails from '../components/AppointmentDetails.vue'
import { supabase } from '../supabase'
import { Chart } from 'chart.js/auto'
import { phoneMask, digitsOnly } from '../utils/phone'
import { fetchStates, fetchCities } from '../utils/locations'
import { cpfMask, cepMask, isValidEmail, formatDateBR } from '../utils/format'
import { addHoursToTime } from '../utils/datetime'

export default {
  name: 'Dashboard',
  components: { Sidebar, HeaderUser, Modal, WeekView, AppointmentDetails },
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
      services: [],
      rooms: [],
      topClients: [],
      sidebarOpen: window.innerWidth >= 768,
      showClientModal: false,
      showAppointmentModal: false,
      editingId: null,
      showDetailsModal: false,
      weekChart: null,
      weekCounts: [0, 0, 0, 0, 0, 0, 0],
      states: [],
      cities: [],
      clientForm: {
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        cpf: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        stateId: '',
        cityId: ''
      },
      appointmentForm: {
        date: '',
        time: '',
        clientId: '',
        serviceId: '',
        duration: '',
        description: ''
      },
      selectedAppointment: null
    }
  },
  methods: {
    phoneMask,
    cpfMask,
    cepMask,
    async fetchStatesList() {
      this.states = await fetchStates()
    },
    async fetchCitiesList() {
      this.cities = await fetchCities(this.clientForm.stateId)
    },
    async openClientModal() {
      await this.fetchStatesList()
      if (this.clientForm.stateId) {
        await this.fetchCitiesList()
      }
      this.showClientModal = true
    },
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
      const counts = [0, 0, 0, 0, 0, 0, 0]
      if (weekData) {
        weekData.forEach(a => {
          const d = new Date(a.date)
          counts[d.getDay()]++
        })
      }
      this.weekCounts = counts

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
      this.$nextTick(() => this.renderWeekChart())
    },
  async fetchUpcomingAppointments() {
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

      const { data } = await supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .gte('date', startWeek)
        .lte('date', endWeek)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

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
      renderWeekChart() {
        const ctx = this.$refs.weekChartCanvas.getContext('2d')
        if (this.weekChart) {
          this.weekChart.destroy()
        }
        this.weekChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            datasets: [{
              label: 'Agendamentos',
              data: this.weekCounts,
              backgroundColor: '#6366f1',
              borderColor: '#4f46e5',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
            }
          }
        })
      },
      getClientName(clientId) {
        const client = this.clients.find(c => c.id === clientId)
        return client ? client.name : ''
      },
      getServiceName(serviceId) {
        const service = this.services.find(s => s.id === serviceId)
        return service ? service.name : ''
      },
      getRoomName(roomId) {
        const room = this.rooms.find(r => r.id === roomId)
        return room ? room.name : ''
      },
      getRoomLink(roomId) {
        const room = this.rooms.find(r => r.id === roomId)
        return room ? room.google_meet_link : ''
      },
      openDetails(appointment) {
        this.selectedAppointment = appointment
        this.showDetailsModal = true
      },
      closeDetails() {
        this.showDetailsModal = false
        this.selectedAppointment = null
      },
      async handleDeleteAppointment(id, confirmMessage = 'Tem certeza que deseja excluir este agendamento?') {
        const confirmed = confirm(confirmMessage)
        if (!confirmed) return

        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id)

        if (error) {
          alert('Erro ao excluir agendamento: ' + error.message)
        } else {
          this.upcomingAppointments = this.upcomingAppointments.filter(a => a.id !== id)
          if (this.selectedAppointment && this.selectedAppointment.id === id) {
            this.closeDetails()
          }
          await this.fetchStats()
          await this.fetchTopClients()
          await this.fetchUpcomingAppointments()
        }
      },
      async handleAddClient() {
      if (this.clientForm.email && !isValidEmail(this.clientForm.email)) {
        alert('E-mail inválido')
        return
      }
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: this.clientForm.name,
          email: this.clientForm.email,
          phone: this.clientForm.phone,
          birthdate: this.clientForm.birthdate,
          cpf: this.clientForm.cpf,
          cep: this.clientForm.cep,
          street: this.clientForm.street,
          number: this.clientForm.number,
          complement: this.clientForm.complement,
          neighborhood: this.clientForm.neighborhood,
          state_id: this.clientForm.stateId,
          city_id: this.clientForm.cityId,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar cliente: ' + error.message)
      } else {
        this.clients.push(data)
        this.clientForm = {
          name: '',
          email: '',
          phone: '',
          birthdate: '',
          cpf: '',
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          stateId: '',
          cityId: ''
        }
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
    openAppointmentModal(appt) {
      if (appt) {
        this.editingId = appt.id
        this.appointmentForm = {
          date: appt.date,
          time: appt.time,
          clientId: appt.client_id,
          serviceId: appt.service_id,
          duration: appt.duration,
          description: appt.description
        }
      } else {
        this.editingId = null
        this.appointmentForm = { date: '', time: '', clientId: '', serviceId: '', duration: '', description: '' }
      }
      this.showAppointmentModal = true
    },
    closeAppointmentModal() {
      this.showAppointmentModal = false
      this.appointmentForm = { date: '', time: '', clientId: '', serviceId: '', duration: '', description: '' }
      this.editingId = null
    },
    editFromDetails() {
      if (this.selectedAppointment) {
        this.openAppointmentModal(this.selectedAppointment)
        this.closeDetails()
      }
    },
    startAppointment() {
      if (!this.selectedAppointment) return
      this.$router.push(`/atendimento/${this.selectedAppointment.id}`)
    },
    async cancelAppointment() {
      if (!this.selectedAppointment) return
      await this.handleDeleteAppointment(
        this.selectedAppointment.id,
        'Tem certeza que deseja desmarcar este atendimento?'
      )
      this.closeDetails()
    },
    markNoShow() {
      alert('Falta registrada para este atendimento.')
    },
    sendConfirmationWhatsApp() {
      const appt = this.selectedAppointment
      if (!appt) return
      const client = this.clients.find(c => c.id === appt.client_id)
      if (!client?.phone) {
        alert('Cliente sem telefone cadastrado')
        return
      }
      const room = this.rooms.find(r => r.id === appt.room_id)
      const message =
        `Olá ${client.name},\n\n` +
        `Passando para informar que seu agendamento está confirmado!\n\n` +
        `Segue os dados para consulta:\n` +
        `Cliente: ${client.name}\n` +
        `Data: ${formatDateBR(appt.date)} - Hora: ${addHoursToTime(appt.time)}\n` +
        `Sala: ${room?.google_meet_link || ''}\n\n` +
        `Obrigado.\n\n` +
        `Está mensagem é uma mensagem automática.`
      const phone = digitsOnly(client.phone)
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    },
    async handleAddAppointment() {
      if (this.editingId) {
        const { data, error } = await supabase
          .from('appointments')
          .update({
            date: this.appointmentForm.date,
            time: this.appointmentForm.time,
            client_id: this.appointmentForm.clientId,
            service_id: this.appointmentForm.serviceId,
            duration: this.appointmentForm.duration,
            description: this.appointmentForm.description
          })
          .eq('id', this.editingId)
          .select()
          .single()

        if (error) {
          alert('Erro ao atualizar agendamento: ' + error.message)
        } else {
          const idx = this.upcomingAppointments.findIndex(a => a.id === this.editingId)
          if (idx !== -1) this.upcomingAppointments[idx] = data
          this.closeAppointmentModal()
          await this.fetchStats()
          await this.fetchUpcomingAppointments()
        }
      } else {
        const { data, error } = await supabase
          .from('appointments')
          .insert({
            date: this.appointmentForm.date,
            time: this.appointmentForm.time,
            client_id: this.appointmentForm.clientId,
            service_id: this.appointmentForm.serviceId,
            duration: this.appointmentForm.duration,
            description: this.appointmentForm.description,
            user_id: this.userId
          })
          .select()
          .single()

        if (error) {
          alert('Erro ao salvar agendamento: ' + error.message)
        } else {
          this.upcomingAppointments.push(data)
          this.closeAppointmentModal()
          this.stats.week += 1
          this.stats.month += 1
          const d = new Date(data.date)
          this.weekCounts[d.getDay()]++
          await this.fetchTopClients()
          this.renderWeekChart()
        }
      }
    }
  },
  watch: {
    'appointmentForm.serviceId'(val) {
      const service = this.services.find(s => s.id === val)
      if (service) {
        if (this.appointmentForm.duration === '') {
          this.appointmentForm.duration = service.duration
        }
      }
    },
    'clientForm.stateId'() {
      this.fetchCitiesList()
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
    const { data: serviceData } = await supabase
      .from('services')
      .select()
      .eq('user_id', this.userId)

    if (serviceData) {
      this.services = serviceData
    }

    const { data: roomsData } = await supabase
      .from('rooms')
      .select()
      .eq('user_id', this.userId)

    if (roomsData) {
      this.rooms = roomsData
    }

    await this.fetchStatesList()
  }
}
</script>
