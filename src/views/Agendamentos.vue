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
      <HeaderUser title="Agendamentos" />
      <section>
        <div class="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="border px-3 py-2 rounded-lg flex-grow sm:max-w-xs"
          />
          <input
            v-model="filterStartDate"
            type="date"
            class="border px-3 py-2 rounded-lg"
          />
          <input
            v-model="filterEndDate"
            type="date"
            class="border px-3 py-2 rounded-lg"
          />
          <button
            @click="clearFilters"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
          >Limpar</button>
          <button
            @click="openModal()"
            class="sm:ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >Novo</button>
          <button
            @click="exportCSV"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full sm:w-auto"
          >Exportar</button>
          <div class="relative">
            <button
              @click="showViewDropdown = !showViewDropdown"
              class="px-4 py-2 bg-gray-200 rounded-lg"
            >
              {{ viewMode === 'list' ? 'Lista' : viewMode === 'calendar' ? 'Calendário' : 'Semana' }}
            </button>
            <div
              v-if="showViewDropdown"
              class="absolute right-0 mt-2 w-32 bg-white border rounded shadow"
            >
              <button
                @click="setViewMode('list')"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >Lista</button>
              <button
                @click="setViewMode('calendar')"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >Calendário</button>
              <button
                @click="setViewMode('week')"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >Semana</button>
            </div>
          </div>
        </div>

        <Modal v-if="showModal" @close="closeModal">
          <h3 class="text-lg font-semibold mb-4">{{ editingId ? 'Editar Agendamento' : 'Adicionar Agendamento' }}</h3>
          <form @submit.prevent="handleSaveAppointment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Data</label>
              <input type="date" v-model="form.date" class="w-full mt-1 px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Hora</label>
              <input type="time" v-model="form.time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
            </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="form.clientId" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option disabled value="">Selecione um cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Serviço</label>
            <select v-model="form.serviceId" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option disabled value="">Selecione um serviço</option>
              <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Duração (minutos)</label>
            <input type="text" v-model="form.duration" class="w-full mt-1 px-4 py-2 border rounded-lg" />
          </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea v-model="form.description" class="w-full mt-1 px-4 py-2 border rounded-lg"></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg border">Cancelar</button>
              <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Salvar</button>
            </div>
          </form>
        </Modal>

        <Modal v-if="showDetailsModal" @close="closeDetails">
          <h3 class="text-lg font-semibold mb-4">Detalhes do Agendamento</h3>
          <div v-if="selectedAppointment" class="space-y-1">
            <p><strong>Data:</strong> {{ selectedAppointment.date }}</p>
            <p><strong>Hora:</strong> {{ selectedAppointment.time }}</p>
            <p><strong>Cliente:</strong> {{ getClientName(selectedAppointment.client_id) }}</p>
            <p><strong>Serviço:</strong> {{ getServiceName(selectedAppointment.service_id) }}</p>
            <p><strong>Duração:</strong> {{ selectedAppointment.duration }}</p>
            <p><strong>Descrição:</strong> {{ selectedAppointment.description }}</p>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="closeDetails" class="px-4 py-2 rounded-lg border">Fechar</button>
          </div>
        </Modal>

        <div class="mt-8" v-show="viewMode === 'list'">
          <h3 class="text-lg font-medium mb-4">Agendamentos</h3>
          <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">
            <table class="min-w-full text-left">
              <thead class="bg-gray-50">
                <tr>
                  <th @click="sortBy('datetime')" class="px-4 py-2 font-medium text-gray-700 cursor-pointer">
                    Data/Hora
                    <span v-if="sortColumn === 'datetime'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('client')" class="px-4 py-2 font-medium text-gray-700 cursor-pointer">
                    Cliente
                    <span v-if="sortColumn === 'client'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('service')" class="px-4 py-2 font-medium text-gray-700 cursor-pointer">
                    Serviço
                    <span v-if="sortColumn === 'service'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('duration')" class="px-4 py-2 font-medium text-gray-700 cursor-pointer">
                    Duração
                    <span v-if="sortColumn === 'duration'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('description')" class="px-4 py-2 font-medium text-gray-700 cursor-pointer">
                    Descrição
                    <span v-if="sortColumn === 'description'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th class="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in processedAppointments" :key="appointment.id" class="border-b last:border-b-0">
                  <td class="px-4 py-2">{{ appointment.date }} {{ appointment.time }}</td>
                  <td class="px-4 py-2">{{ getClientName(appointment.client_id) }}</td>
                  <td class="px-4 py-2">{{ getServiceName(appointment.service_id) }}</td>
                  <td class="px-4 py-2">{{ appointment.duration }}</td>
                  <td class="px-4 py-2">{{ appointment.description }}</td>
                  <td class="px-4 py-2 text-right">
                    <button @click="openModal(appointment)" class="text-blue-600 hover:underline">Editar</button>
                    <button @click="handleDeleteAppointment(appointment.id)" class="text-red-600 hover:underline ml-2">Excluir</button>
                  </td>
                </tr>
                <tr v-if="processedAppointments.length === 0">
                  <td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhum agendamento encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8" v-show="viewMode === 'calendar'">
          <h3 class="text-lg font-medium mb-4">Calendário</h3>
          <CalendarView
            ref="calendarView"
            :appointments="processedAppointments"
            :getClientName="getClientName"
          />
        </div>

        <div class="mt-8" v-show="viewMode === 'week'">
          <h3 class="text-lg font-medium mb-4">Semana</h3>
          <WeekView
            :appointments="processedAppointments"
            :getClientName="getClientName"
            @select="openDetails"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import Modal from '../components/Modal.vue'
import CalendarView from '../components/CalendarView.vue'
import WeekView from '../components/WeekView.vue'
import { supabase } from '../supabase'

export default {
  name: 'Agendamentos',
  components: { Sidebar, HeaderUser, Modal, CalendarView, WeekView },
  data() {
    return {
      userId: null,
      showModal: false,
      editingId: null,
      viewMode: 'week',
      form: {
        date: '',
        time: '',
        clientId: '',
        serviceId: '',
        duration: '',
        description: ''
      },
      clients: [],
      services: [],
      appointments: [],
      selectedAppointment: null,
      showDetailsModal: false,
      filterStartDate: '',
      filterEndDate: '',
      searchQuery: '',
      sortColumn: '',
      sortAsc: true,
      showViewDropdown: false,
      sidebarOpen: true
    }
  },
  computed: {
    processedAppointments() {
      let result = this.appointments.slice()
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        result = result.filter(a => {
          return (
            a.date.toLowerCase().includes(q) ||
            a.time.toLowerCase().includes(q) ||
            this.getClientName(a.client_id).toLowerCase().includes(q) ||
            this.getServiceName(a.service_id).toLowerCase().includes(q) ||
            (a.description && a.description.toLowerCase().includes(q))
          )
        })
      }
      if (this.filterStartDate) {
        result = result.filter(a => a.date >= this.filterStartDate)
      }
      if (this.filterEndDate) {
        result = result.filter(a => a.date <= this.filterEndDate)
      }
      if (this.sortColumn) {
        result.sort((a, b) => {
          let valA, valB
          switch (this.sortColumn) {
            case 'client':
              valA = this.getClientName(a.client_id)
              valB = this.getClientName(b.client_id)
              break
            case 'service':
              valA = this.getServiceName(a.service_id)
              valB = this.getServiceName(b.service_id)
              break
            case 'datetime':
              valA = a.date + ' ' + a.time
              valB = b.date + ' ' + b.time
              break
            default:
              valA = a[this.sortColumn]
              valB = b[this.sortColumn]
          }
          if (valA < valB) return this.sortAsc ? -1 : 1
          if (valA > valB) return this.sortAsc ? 1 : -1
          return 0
        })
      }
      return result
    }
  },
  methods: {
    openModal(appointment) {
      if (appointment) {
        this.editingId = appointment.id
        this.form = {
          date: appointment.date,
          time: appointment.time,
          clientId: appointment.client_id,
          serviceId: appointment.service_id,
          duration: appointment.duration,
          description: appointment.description
        }
      } else {
        this.editingId = null
        this.form = { date: '', time: '', clientId: '', serviceId: '', duration: '', description: '' }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = { date: '', time: '', clientId: '', serviceId: '', duration: '', description: '' }
      this.editingId = null
    },
    closeDetails() {
      this.showDetailsModal = false
      this.selectedAppointment = null
    },
    async handleSaveAppointment() {
      if (this.editingId) {
        const { data, error } = await supabase
          .from('appointments')
          .update({
            date: this.form.date,
            time: this.form.time,
            client_id: this.form.clientId,
            service_id: this.form.serviceId,
            duration: this.form.duration,
            description: this.form.description
          })
          .eq('id', this.editingId)
          .select()
          .single()

        if (error) {
          alert('Erro ao atualizar agendamento: ' + error.message)
        } else {
          const index = this.appointments.findIndex(a => a.id === this.editingId)
          if (index !== -1) this.appointments[index] = data
          this.closeModal()
        }
      } else {
        const { data, error } = await supabase
          .from('appointments')
          .insert({
            date: this.form.date,
            time: this.form.time,
            client_id: this.form.clientId,
            service_id: this.form.serviceId,
            duration: this.form.duration,
            description: this.form.description,
            user_id: this.userId
          })
          .select()
          .single()

        if (error) {
          alert('Erro ao salvar agendamento: ' + error.message)
        } else {
          this.appointments.push(data)
          this.closeModal()
        }
      }
    },
    async handleDeleteAppointment(id) {
      const confirmed = confirm(
        'Tem certeza que deseja excluir este agendamento?'
      )
      if (!confirmed) return

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Erro ao excluir agendamento: ' + error.message)
      } else {
        this.appointments = this.appointments.filter(a => a.id !== id)
      }
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.id === clientId)
      return client ? client.name : ''
    },
    getServiceName(serviceId) {
      const service = this.services.find(s => s.id === serviceId)
      return service ? service.name : ''
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortColumn = column
        this.sortAsc = true
      }
    },
    setViewMode(mode) {
      this.viewMode = mode
      this.showViewDropdown = false
      if (mode === 'calendar' && this.$refs.calendarView && this.$refs.calendarView.goToCurrentMonth) {
        this.$refs.calendarView.goToCurrentMonth()
      }
    },
    openDetails(appointment) {
      this.selectedAppointment = appointment
      this.showDetailsModal = true
    },
    exportCSV() {
      const headers = ['Data', 'Hora', 'Cliente', 'Serviço', 'Duração', 'Descrição']
      const rows = this.appointments.map(a => [
        a.date,
        a.time,
        this.getClientName(a.client_id),
        this.getServiceName(a.service_id),
        a.duration,
        (a.description || '').replace(/(\r\n|\n|\r)/g, ' ')
      ])
      const csv = [headers.join(','),
        ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      ].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'agendamentos.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    clearFilters() {
      this.searchQuery = ''
      this.filterStartDate = ''
      this.filterEndDate = ''
    }
  },
  watch: {
    'form.serviceId'(val) {
      const service = this.services.find(s => s.id === val)
      if (service) {
        if (!this.editingId || this.form.duration === '') {
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

    if (serviceData) {
      this.services = serviceData
    }

    const { data: appointmentData } = await supabase
      .from('appointments')
      .select()
      .eq('user_id', this.userId)

    if (appointmentData) {
      this.appointments = appointmentData
    }
  }
}
</script>
