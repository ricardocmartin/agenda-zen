<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-8">
      <HeaderUser title="Agendamentos" />
      <section>
        <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Novo Agendamento</button>

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
              <label class="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea v-model="form.description" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
              <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
            </div>
          </form>
        </Modal>

        <div class="mt-8">
          <h3 class="text-lg font-medium mb-4">Agendamentos</h3>
          <ul class="space-y-2">
            <li v-for="appointment in appointments" :key="appointment.id" class="p-3 bg-white shadow rounded">
              <div class="flex justify-between items-center">
                <span>
                  <strong>{{ appointment.date }} {{ appointment.time }}</strong> -
                  {{ getClientName(appointment.client_id) }} - {{ appointment.description }}
                </span>
                <div class="space-x-2">
                  <button @click="openModal(appointment)" class="text-blue-600 hover:underline">Editar</button>
                  <button @click="handleDeleteAppointment(appointment.id)" class="text-red-600 hover:underline">Excluir</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import Modal from '../components/Modal.vue'
import { supabase } from '../supabase'

export default {
  name: 'Agendamentos',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      showModal: false,
      editingId: null,
      form: {
        date: '',
        time: '',
        clientId: '',
        description: ''
      },
      clients: [],
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
          description: appointment.description
        }
      } else {
        this.editingId = null
        this.form = { date: '', time: '', clientId: '', description: '' }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = { date: '', time: '', clientId: '', description: '' }
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
