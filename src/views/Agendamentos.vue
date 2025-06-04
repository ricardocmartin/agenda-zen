<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-8">
      <HeaderUser title="Agendamentos" />
      <section>
        <div class="flex items-center space-x-2 mb-4">
          <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Novo Agendamento</button>
          <div class="ml-auto flex space-x-2">
            <button
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
              class="px-4 py-2 rounded"
            >Lista</button>
            <button
              @click="viewMode = 'calendar'"
              :class="viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
              class="px-4 py-2 rounded"
            >Calendário</button>
          </div>
        </div>

        <Modal v-if="showModal" @close="closeModal">
          <h3 class="text-lg font-semibold mb-4">{{ editingId ? 'Editar Agendamento' : 'Adicionar Agendamento' }}</h3>
          <form @submit.prevent="handleSaveAppointment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Data</label>
              <input type="date" v-model="form.date" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Hora</label>
              <input type="time" v-model="form.time" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="form.clientId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione um cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Serviço</label>
            <select v-model="form.serviceId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione um serviço</option>
              <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Duração (minutos)</label>
            <input type="text" v-model="form.duration" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea v-model="form.description" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
              <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
            </div>
          </form>
        </Modal>

        <div class="mt-8" v-show="viewMode === 'list'">
          <h3 class="text-lg font-medium mb-4">Agendamentos</h3>
          <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">
            <table class="min-w-full text-left">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 font-medium text-gray-700">Data</th>
                  <th class="px-4 py-2 font-medium text-gray-700">Hora</th>
                  <th class="px-4 py-2 font-medium text-gray-700">Cliente</th>
                  <th class="px-4 py-2 font-medium text-gray-700">Serviço</th>
                  <th class="px-4 py-2 font-medium text-gray-700">Duração</th>
                  <th class="px-4 py-2 font-medium text-gray-700">Descrição</th>
                  <th class="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in appointments" :key="appointment.id" class="border-b last:border-b-0">
                  <td class="px-4 py-2">{{ appointment.date }}</td>
                  <td class="px-4 py-2">{{ appointment.time }}</td>
                  <td class="px-4 py-2">{{ getClientName(appointment.client_id) }}</td>
                  <td class="px-4 py-2">{{ getServiceName(appointment.service_id) }}</td>
                  <td class="px-4 py-2">{{ appointment.duration }}</td>
                  <td class="px-4 py-2">{{ appointment.description }}</td>
                  <td class="px-4 py-2 text-right">
                    <button @click="openModal(appointment)" class="text-blue-600 hover:underline">Editar</button>
                    <button @click="handleDeleteAppointment(appointment.id)" class="text-red-600 hover:underline ml-2">Excluir</button>
                  </td>
                </tr>
                <tr v-if="appointments.length === 0">
                  <td colspan="7" class="px-4 py-6 text-center text-gray-500">Nenhum agendamento encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8" v-show="viewMode === 'calendar'">
          <h3 class="text-lg font-medium mb-4">Calendário</h3>
          <CalendarView :appointments="appointments" :getClientName="getClientName" />
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
import { supabase } from '../supabase'

export default {
  name: 'Agendamentos',
  components: { Sidebar, HeaderUser, Modal, CalendarView },
  data() {
    return {
      userId: null,
      showModal: false,
      editingId: null,
      viewMode: 'list',
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
      appointments: []
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
