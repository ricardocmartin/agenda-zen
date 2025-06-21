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
            class="btn sm:ml-auto w-full sm:w-auto"
          >Novo</button>
          <button
            @click="exportCSV"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full sm:w-auto"
          >Exportar</button>
        </div>
        <div class="mb-4 flex items-center space-x-2">
          <span class="text-xs text-gray-600">Modo de exibição:</span>
          <div class="relative">
            <button
              @click="showViewDropdown = !showViewDropdown"
              class="px-4 py-2 bg-gray-200 rounded-lg"
            >
              {{ viewMode === 'list' ? 'Lista' : viewMode === 'calendar' ? 'Calendário' : 'Semana' }}
            </button>
            <div
              v-if="showViewDropdown"
              class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-20"
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
            <label class="block text-sm font-medium text-gray-700">Sala de Reunião</label>
            <select v-model="form.roomId" class="w-full mt-1 px-4 py-2 border rounded-lg">
              <option disabled value="">Selecione uma sala</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
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
              <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
              <button type="submit" class="btn">Salvar</button>
            </div>
          </form>
        </Modal>

        <Modal v-if="showDetailsModal" @close="closeDetails">
          <h3 class="text-lg font-semibold mb-4">Detalhes do Agendamento</h3>
          <div v-if="selectedAppointment" class="space-y-1 border rounded-md p-4 bg-gray-50 text-gray-700">
            <p><strong>Data:</strong> {{ selectedAppointment.date }}</p>
            <p><strong>Hora:</strong> {{ selectedAppointment.time }}</p>
            <p><strong>Cliente:</strong> {{ getClientName(selectedAppointment.client_id) }}</p>
            <p><strong>Serviço:</strong> {{ getServiceName(selectedAppointment.service_id) }}</p>
            <p><strong>Duração:</strong> {{ selectedAppointment.duration }}</p>
            <p><strong>Descrição:</strong> {{ selectedAppointment.description }}</p>
            <p v-if="selectedAppointment.room_id"><strong>Sala:</strong> {{ getRoomName(selectedAppointment.room_id) }}</p>
            <p v-if="selectedAppointment.room_id && getRoomLink(selectedAppointment.room_id)">
              <a :href="getRoomLink(selectedAppointment.room_id)" target="_blank" class="text-blue-600 underline">Acessar Google Meet</a>
            </p>
          </div>
          <div class="flex justify-center mt-4 space-x-2">
            <button @click="startAppointment" class="btn btn-primary">Iniciar atendimento</button>
            <button @click="cancelAppointment" class="btn btn-warning">Desmarcou atendimento</button>
            <button @click="markNoShow" class="btn btn-secondary">Faltou ao atendimento</button>
            <button @click="sendConfirmationWhatsApp" class="btn btn-success">Enviar confirmação</button>
            <button @click="handleDeleteAppointment(selectedAppointment.id)" class="btn btn-danger">Excluir</button>
            <button @click="editFromDetails" class="btn">Editar</button>
            <button @click="closeDetails" class="px-4 py-2 rounded border">Fechar</button>
            </div>
          </Modal>

        <div class="mt-8" v-show="viewMode === 'list'">
          <h3 class="text-lg font-medium mb-4">Agendamentos</h3>
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="overflow-x-auto">
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
                  <th class="px-4 py-2 font-medium text-gray-700">Sala</th>
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
                  <td class="px-4 py-2">{{ getRoomName(appointment.room_id) }}</td>
                  <td class="px-4 py-2">{{ appointment.duration }}</td>
                  <td class="px-4 py-2">{{ appointment.description }}</td>
                  <td class="px-4 py-2 text-right space-x-2">
                    <button @click="openModal(appointment)" class="btn btn-sm">Editar</button>
                    <button @click="handleDeleteAppointment(appointment.id)" class="btn btn-sm btn-danger">Excluir</button>
                  </td>
                </tr>
                <tr v-if="processedAppointments.length === 0">
                  <td colspan="7" class="px-4 py-6 text-center text-gray-500">Nenhum agendamento encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>

        <div class="mt-8" v-show="viewMode === 'calendar'">
          <h3 class="text-lg font-medium mb-4">Calendário</h3>
          <CalendarView
            ref="calendarView"
            :appointments="processedAppointments"
            :getClientName="getClientName"
            @select="openDetails"
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
import { sendAppointmentEmail } from '../utils/email'
import { digitsOnly } from '../utils/phone'

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
        roomId: '',
        duration: '',
        description: ''
      },
      clients: [],
      services: [],
      rooms: [],
      appointments: [],
      selectedAppointment: null,
      showDetailsModal: false,
      filterStartDate: '',
      filterEndDate: '',
      searchQuery: '',
      sortColumn: '',
      sortAsc: true,
      showViewDropdown: false,
      sidebarOpen: window.innerWidth >= 768,
      schedule: {
        startTime: '',
        endTime: '',
        weekDays: [],
        dailySchedule: null
      },
      profileWhatsapp: ''
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
          roomId: appointment.room_id || '',
          duration: appointment.duration,
          description: appointment.description
        }
      } else {
        this.editingId = null
        this.form = { date: '', time: '', clientId: '', serviceId: '', roomId: '', duration: '', description: '' }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = { date: '', time: '', clientId: '', serviceId: '', roomId: '', duration: '', description: '' }
      this.editingId = null
    },
    editFromDetails() {
      if (this.selectedAppointment) {
        this.openModal(this.selectedAppointment)
        this.closeDetails()
      }
    },
    closeDetails() {
      this.showDetailsModal = false
      this.selectedAppointment = null
    },
    isSlotAllowed(dateStr, timeStr) {
      if (!dateStr || !timeStr) return false
      // Parse date using local timezone to avoid day offset issues
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
    async handleSaveAppointment() {
      if (!this.isSlotAllowed(this.form.date, this.form.time)) {
        alert('Horário fora do horário de trabalho configurado')
        return
      }
      if (this.editingId) {
        const { data, error } = await supabase
          .from('appointments')
          .update({
            date: this.form.date,
            time: this.form.time,
            client_id: this.form.clientId,
            service_id: this.form.serviceId,
            room_id: this.form.roomId || null,
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
            room_id: this.form.roomId || null,
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
          const client = this.clients.find(c => c.id === this.form.clientId)
          const service = this.services.find(s => s.id === this.form.serviceId)
          const room = this.rooms.find(r => r.id === this.form.roomId)
          await sendAppointmentEmail({
            to: client?.email,
            subject: `Agendamento confirmado para ${this.form.date} às ${this.form.time}`,
            text: `Olá ${client?.name},\n\nSeu agendamento para ${service?.name} foi confirmado para ${this.form.date} às ${this.form.time}.\n${room ? `Sala: ${room.name}\n` : ''}${room?.google_meet_link ? `Link: ${room.google_meet_link}\n` : ''}${this.form.description ? `Observações: ${this.form.description}` : ''}`
          })
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
        if (this.selectedAppointment && this.selectedAppointment.id === id) {
          this.showDetailsModal = false
          this.selectedAppointment = null
        }
      }
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.id === clientId)
      return client ? client.name : ''
    },
    getClientEmail(clientId) {
      const client = this.clients.find(c => c.id === clientId)
      return client ? client.email : ''
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
    startAppointment() {
      if (!this.selectedAppointment) return
      const link = this.getRoomLink(this.selectedAppointment.room_id)
      if (link) {
        window.open(link, '_blank')
      } else {
        alert('Início do atendimento registrado.')
      }
    },
    async cancelAppointment() {
      if (!this.selectedAppointment) return
      const confirmed = confirm('Tem certeza que deseja desmarcar este atendimento?')
      if (!confirmed) return
      await this.handleDeleteAppointment(this.selectedAppointment.id)
      this.closeDetails()
    },
    markNoShow() {
      alert('Falta registrada para este atendimento.')
    },
    async sendConfirmationEmail() {
      const appt = this.selectedAppointment
      if (!appt) return
      const client = this.clients.find(c => c.id === appt.client_id)
      const service = this.services.find(s => s.id === appt.service_id)
      const room = this.rooms.find(r => r.id === appt.room_id)
      await sendAppointmentEmail({
        to: client?.email,
        subject: `Agendamento confirmado para ${appt.date} às ${appt.time}`,
        text: `Olá ${client?.name},\n\nSeu agendamento para ${service?.name} foi confirmado para ${appt.date} às ${appt.time}.\n${room ? `Sala: ${room.name}\n` : ''}${room?.google_meet_link ? `Link: ${room.google_meet_link}\n` : ''}${appt.description ? `Observações: ${appt.description}` : ''}`
      })
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
        `Data: ${appt.date} - Hora: ${appt.time}\n` +
        `Sala: ${room?.google_meet_link || ''}\n\n` +
        `Obrigado.\n\n` +
        `Está mensagem é uma mensagem automática.`
      const phone = digitsOnly(client.phone)
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
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

    const { data: roomsData } = await supabase
      .from('rooms')
      .select()
      .eq('user_id', this.userId)

    if (roomsData) {
      this.rooms = roomsData
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('start_time, end_time, week_days, daily_schedule, whatsapp')
      .eq('id', this.userId)
      .single()

    if (profileData) {
      this.schedule.startTime = profileData.start_time || ''
      this.schedule.endTime = profileData.end_time || ''
      this.schedule.weekDays = profileData.week_days
        ? profileData.week_days.split(',')
        : []
      this.schedule.dailySchedule = profileData.daily_schedule
        ? typeof profileData.daily_schedule === 'string'
          ? JSON.parse(profileData.daily_schedule)
          : profileData.daily_schedule
        : null
      this.profileWhatsapp = profileData.whatsapp || ''
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
