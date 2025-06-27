<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8 space-y-6">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <HeaderUser title="Clientes" />

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h3 class="text-lg font-medium">Clientes cadastrados</h3>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button
              @click="openModal"
              class="btn w-full sm:w-auto"
            >
              Novo Cliente
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Nome</th>
                <th class="px-4 py-2 font-medium text-gray-700">E-mail</th>
                <th class="px-4 py-2 font-medium text-gray-700">Telefone</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="client in paginatedClients"
                :key="client.id"
                class="border-b last:border-b-0"
              >
                <td class="px-4 py-2">
                  <span>{{ client.name }}</span>
                  <span
                    v-if="client.from_site && client.pending_update"
                    class="inline-flex items-center text-red-600 text-xs ml-2"
                  >
                    <span class="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                    cliente cadastrado via site - pendente atualização
                  </span>
                </td>
                <td class="px-4 py-2">{{ client.email }}</td>
                <td class="px-4 py-2">{{ phoneMask(client.phone) }}</td>
                <td class="px-4 py-2 text-right space-x-2">
                  <a
                    :href="whatsappLink(client.phone)"
                    target="_blank"
                    rel="noopener"
                    class="btn btn-sm btn-success"
                  >
                    WhatsApp
                  </a>
                  <button
                    @click="openModal(client, 'view')"
                    class="btn btn-sm"
                  >
                    Visualizar
                  </button>
                  <button
                    @click="handleDeleteClient(client.id)"
                    class="btn btn-sm btn-danger"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Nenhum cliente encontrado
                </td>
              </tr>
          </tbody>
        </table>
        <div class="mt-4 flex justify-between items-center">
          <button
            class="px-3 py-1 border rounded"
            @click="prevPage"
            :disabled="page === 1"
          >
            Anterior
          </button>
          <span class="text-sm">Página {{ page }} de {{ totalPages }}</span>
          <button
            class="px-3 py-1 border rounded"
            @click="nextPage"
            :disabled="page === totalPages"
          >
            Próxima
          </button>
        </div>
      </div>
      </section>

        <Modal v-if="showModal" @close="handleClose">
          <h3 class="text-lg font-semibold mb-4">
            {{ modalMode === 'new' ? 'Adicionar Cliente' : 'Cadastro do Cliente' }}
          </h3>
          <div
            v-if="currentClient && currentClient.from_site && currentClient.pending_update"
            class="flex items-center text-red-600 text-sm mb-4"
          >
            <span class="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
            cliente cadastrado via site - pendente atualização
          </div>
          <div v-if="editingId" class="border-b mb-4">
            <nav class="flex space-x-4">
              <button
                :class="activeTab === 'cadastro' ? 'border-b-2 border-blue-500 pb-2' : 'text-gray-500 pb-2'"
                @click="changeTab('cadastro')"
              >Cadastro</button>
              <button
                :class="activeTab === 'agendamentos' ? 'border-b-2 border-blue-500 pb-2' : 'text-gray-500 pb-2'"
                @click="changeTab('agendamentos')"
              >Agendamentos</button>
              <button
                :class="activeTab === 'historico' ? 'border-b-2 border-blue-500 pb-2' : 'text-gray-500 pb-2'"
                @click="changeTab('historico')"
              >Histórico de atendimento</button>
            </nav>
          </div>
          <form v-show="activeTab === 'cadastro'" @submit.prevent="handleSaveClient" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="form.name" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CPF</label>
          <input
            type="text"
            v-model="form.cpf"
            :disabled="isReadOnly"
            @input="form.cpf = cpfMask(form.cpf)"
            class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Data de nascimento</label>
            <input type="date" v-model="form.birthdate" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" v-model="form.email" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              v-model="form.phone"
              :disabled="isReadOnly"
              @input="form.phone = phoneMask(form.phone)"
              class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CEP</label>
          <input
            type="text"
            v-model="form.cep"
            :disabled="isReadOnly"
            @input="form.cep = cepMask(form.cep)"
            class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" v-model="form.street" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Número</label>
            <input type="text" v-model="form.number" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Complemento</label>
            <input type="text" v-model="form.complement" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bairro</label>
            <input type="text" v-model="form.neighborhood" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <select v-model="form.stateId" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option v-for="s in states" :key="s.id" :value="s.id">{{ s.nome }} ({{ s.sigla }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cidade</label>
            <select v-model="form.cityId" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.nome }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Ativo?</label>
            <select v-model="form.active" :disabled="isReadOnly" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 md:col-span-2">
            <button type="button" @click="handleClose" class="px-4 py-2 rounded border">Fechar</button>
            <button v-if="modalMode === 'view'" type="button" @click="enableEdit" class="btn btn-success">Editar</button>
            <button type="submit" class="btn" :disabled="isReadOnly">Salvar</button>
          </div>
        </form>

        <div v-show="activeTab === 'agendamentos'" class="overflow-x-auto">
          <table class="min-w-full text-left border-separate border-spacing-0">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Data/Hora</th>
                <th class="px-4 py-2 font-medium text-gray-700">Serviço</th>
                <th class="px-4 py-2 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in clientAppointments" :key="a.id">
                <td
                  :class="[
                    'px-4 py-2',
                    a.from_site && !a.confirmed
                      ? 'border-l-2 border-t-2 border-b-2 border-red-500 rounded-l-md'
                      : 'border-b last:border-b-0'
                  ]"
                >
                  {{ formatDateBR(a.date) }} {{ addHoursToTime(a.time) }}
                  <span
                    v-if="a.from_site && !a.confirmed"
                    class="block text-xs text-red-600"
                  >pendente confirmação de pagamento</span>
                </td>
                <td
                  :class="[
                    'px-4 py-2',
                    a.from_site && !a.confirmed
                      ? 'border-t-2 border-b-2 border-red-500'
                      : 'border-b last:border-b-0'
                  ]"
                >
                  {{ getServiceName(a.service_id) }}
                </td>
                <td
                  :class="[
                    'px-4 py-2 text-right space-x-2',
                    a.from_site && !a.confirmed
                      ? 'border-r-2 border-t-2 border-b-2 border-red-500 rounded-r-md'
                      : 'border-b last:border-b-0'
                  ]"
                >
                  <router-link :to="{ path: '/agendamentos', query: { edit: a.id } }" class="btn btn-sm">Editar</router-link>
                  <button @click="sendConfirmationEmail(a)" class="btn btn-sm btn-success">Enviar e-mail</button>
                </td>
              </tr>
              <tr v-if="clientAppointments.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500">Nenhum agendamento</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-show="activeTab === 'historico'" class="space-y-4">
          <div v-for="h in history" :key="h.id" class="border p-2 rounded">
            <p class="text-sm text-gray-600 mb-1">{{ formatDateBR(h.appointment.date) }} {{ addHoursToTime(h.appointment.time) }}</p>
            <p class="mb-2 whitespace-pre-line">{{ h.note }}</p>
            <div v-if="h.attachments && h.attachments.length" class="space-x-2 mb-2">
              <a v-for="(url, idx) in h.attachments" :key="idx" :href="url" target="_blank" download class="text-blue-600 underline">Anexo {{ idx + 1 }}</a>
            </div>
            <div class="text-right">
              <router-link :to="{ path: `/atendimento/${h.appointment_id}`, query: { note: h.id } }" class="btn btn-sm">Editar atendimento</router-link>
            </div>
          </div>
          <p v-if="history.length === 0" class="text-center text-gray-500">Nenhum atendimento encontrado</p>
        </div>

      </Modal>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import Modal from '../components/Modal.vue'
import { supabase } from '../supabase'
import { phoneMask, digitsOnly } from '../utils/phone'
import { fetchStates, fetchCities, fetchAddress } from '../utils/locations'
import { cpfMask, cepMask, isValidEmail, formatDateBR } from '../utils/format'
import { addHoursToTime } from '../utils/datetime'
import { sendAppointmentEmail } from '../utils/email'

export default {
  name: 'Clientes',
  components: { Sidebar, HeaderUser, Modal },
  data() {
      return {
        userId: null,
        showModal: false,
        modalMode: 'new',
        editingId: null,
        search: '',
        form: {
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
          cityId: '',
          from_site: false,
          pending_update: false,
          active: true
        },
        states: [],
        cities: [],
        clients: [],
        sidebarOpen: window.innerWidth >= 768,
        page: 1,
        pageSize: 10,
        activeTab: 'cadastro',
        originalForm: {},
        clientAppointments: [],
        history: [],
        services: [],
        rooms: [],
        currentClient: null
    }
  },
  methods: {
    phoneMask,
    digitsOnly,
    cpfMask,
    cepMask,
    formatDateBR,
    addHoursToTime,
    async fetchServicesList() {
      const { data } = await supabase
        .from('services')
        .select()
        .eq('user_id', this.userId)
        .eq('active', true)
      if (data) this.services = data
    },
    async fetchRoomsList() {
      const { data } = await supabase
        .from('rooms')
        .select()
        .eq('user_id', this.userId)
        .eq('active', true)
      if (data) this.rooms = data
    },
    async fetchStatesList() {
      this.states = await fetchStates()
    },
    async fetchCitiesList() {
      this.cities = await fetchCities(this.form.stateId)
    },
    async fillAddressByCep() {
      const addr = await fetchAddress(this.form.cep)
      if (!addr) return
      this.form.street = addr.street || ''
      this.form.complement = addr.complement || ''
      this.form.neighborhood = addr.neighborhood || ''
      const state = this.states.find(s => s.sigla === addr.state)
      if (state) {
        this.form.stateId = state.id
        await this.fetchCitiesList()
        const city = this.cities.find(c => c.nome.toLowerCase() === addr.city.toLowerCase())
        if (city) this.form.cityId = city.id
      }
    },
   async openModal(client, mode = 'new') {
      this.modalMode = mode
      this.activeTab = 'cadastro'
      this.currentClient = client || null
      if (client) {
        this.editingId = client.id
        this.form = {
          name: client.name,
          email: client.email,
          phone: client.phone,
          birthdate: client.birthdate,
          cpf: client.cpf,
          cep: client.cep,
          street: client.street,
          number: client.number,
          complement: client.complement,
          neighborhood: client.neighborhood,
          stateId: client.state_id,
          cityId: client.city_id,
          from_site: client.from_site,
          pending_update: client.pending_update,
          active: client.active
        }
        this.originalForm = { ...this.form }
        await this.fetchClientAppointments()
        await this.fetchClientHistory()
      } else {
        this.editingId = null
        this.form = { name: '', email: '', phone: '', birthdate: '', cpf: '', cep: '', street: '', number: '', complement: '', neighborhood: '', stateId: '', cityId: '', from_site: false, pending_update: false, active: true }
        this.originalForm = { ...this.form }
        this.clientAppointments = []
        this.history = []
      }
      await this.fetchStatesList()
      if (this.form.stateId) {
        await this.fetchCitiesList()
      }
      await this.fetchServicesList()
      await this.fetchRoomsList()
      this.showModal = true
    },
  closeModal() {
      this.showModal = false
      this.modalMode = 'new'
      this.editingId = null
      this.form = { name: '', email: '', phone: '', birthdate: '', cpf: '', cep: '', street: '', number: '', complement: '', neighborhood: '', stateId: '', cityId: '', from_site: false, pending_update: false, active: true }
      this.activeTab = 'cadastro'
      this.clientAppointments = []
      this.history = []
      this.currentClient = null
    },
    handleClose() {
      if (this.modalMode === 'view') {
        this.closeModal()
      } else {
        if (confirm('Tem certeza? Os dados não foram salvos e serão perdidos.')) {
          this.closeModal()
        }
      }
    },
    whatsappLink(phone) {
      const formatted = digitsOnly(phone)
      return `https://wa.me/${formatted}`
    },
   async handleSaveClient() {
      if (this.form.email && !isValidEmail(this.form.email)) {
        alert('E-mail inválido')
        return
      }
      let data, error
      if (this.editingId) {
        ;({ data, error } = await supabase
          .from('clients')
          .update({
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            birthdate: this.form.birthdate,
            cpf: this.form.cpf,
            cep: this.form.cep,
            street: this.form.street,
            number: this.form.number,
            complement: this.form.complement,
          neighborhood: this.form.neighborhood,
          state_id: this.form.stateId,
          city_id: this.form.cityId,
          pending_update: false,
          active: this.form.active
        })
          .eq('id', this.editingId)
          .select()
          .single())
        this.originalForm = { ...data }
      } else {
        ;({ data, error } = await supabase
          .from('clients')
          .insert({
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            birthdate: this.form.birthdate,
            cpf: this.form.cpf,
            cep: this.form.cep,
            street: this.form.street,
            number: this.form.number,
            complement: this.form.complement,
          neighborhood: this.form.neighborhood,
          state_id: this.form.stateId,
          city_id: this.form.cityId,
          user_id: this.userId,
          from_site: this.form.from_site,
          pending_update: this.form.pending_update,
          active: this.form.active
        })
          .select()
          .single())
        this.originalForm = { ...data }
      }

      if (error) {
        alert('Erro ao salvar cliente: ' + error.message)
      } else {
        if (this.editingId) {
          const index = this.clients.findIndex(c => c.id === this.editingId)
          if (index !== -1) this.clients[index] = data
        } else {
          this.clients.push(data)
        }
        this.closeModal()
        this.currentClient = null
      }
    },
    async handleDeleteClient(id) {
      const confirmed = confirm('Tem certeza que deseja excluir este cliente?')
      if (!confirmed) return

      const { data: appts } = await supabase
        .from('appointments')
        .select('id')
        .eq('client_id', id)
        .limit(1)

      if (appts && appts.length) {
        const { error: updError } = await supabase
          .from('clients')
          .update({ active: false })
          .eq('id', id)

        if (updError) {
          alert('Erro ao inativar cliente: ' + updError.message)
        } else {
          const idx = this.clients.findIndex(c => c.id === id)
          if (idx !== -1) this.clients[idx].active = false
          alert('Cliente inativado.')
        }
        return
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Erro ao excluir cliente: ' + error.message)
      } else {
        this.clients = this.clients.filter(c => c.id !== id)
      }
    },
    enableEdit() {
      this.modalMode = 'edit'
    },
    changeTab(tab) {
      if (tab !== 'cadastro' && this.modalMode !== 'view') {
        const confirmed = confirm('Dados não salvos serão perdidos. Deseja continuar?')
        if (!confirmed) return
        this.modalMode = 'view'
        this.form = { ...this.originalForm }
      }
      this.activeTab = tab
    },
    async fetchClientAppointments() {
      if (!this.editingId) { this.clientAppointments = []; return }
      const { data } = await supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .eq('client_id', this.editingId)
        .order('date', { ascending: true })
        .order('time', { ascending: true })
      this.clientAppointments = data || []
    },
    async fetchClientHistory() {
      if (!this.editingId) { this.history = []; return }
      if (!this.clientAppointments.length) { this.history = []; return }
      const ids = this.clientAppointments.map(a => a.id)
      const { data } = await supabase
        .from('appointment_notes')
        .select()
        .in('appointment_id', ids)
        .order('created_at', { ascending: false })
      this.history = (data || []).map(n => ({
        ...n,
        attachments: n.attachments || [],
        appointment: this.clientAppointments.find(a => a.id === n.appointment_id) || {}
      }))
    },
    getServiceName(id) {
      const s = this.services.find(sv => sv.id === id)
      return s ? s.name : ''
    },
    async sendConfirmationEmail(appt) {
      const client = this.clients.find(c => c.id === appt.client_id)
      const service = this.services.find(s => s.id === appt.service_id)
      const room = this.rooms.find(r => r.id === appt.room_id)
      await sendAppointmentEmail({
        to: client?.email,
        subject: 'Agendamento de Consulta realizado',
        text:
          `Olá ${client?.name},\n\n` +
          `Seu agendamento para ${service?.name} foi confirmado para ${formatDateBR(appt.date)} às ${addHoursToTime(appt.time)}.\n` +
          `${room ? `Sala: ${room.name}\n` : ''}` +
          `${room?.google_meet_link ? `Link: ${room.google_meet_link}\n` : ''}` +
          `${appt.description ? `Observações: ${appt.description}\n` : ''}` +
          `\nE-mail enviado automaticamente.`
      })
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    prevPage() {
      if (this.page > 1) this.page--
    }
  },
  computed: {
    isReadOnly() {
      return this.modalMode === 'view'
    },
    filteredClients() {
      const term = this.search.toLowerCase()
      return this.clients.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term)
      )
    },
    paginatedClients() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredClients.slice(start, start + this.pageSize)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredClients.length / this.pageSize))
    }
  },
  watch: {
    search() {
      this.page = 1
    },
    'form.stateId'() {
      this.fetchCitiesList()
    },
    'form.cep'(val) {
      const digits = (val || '').toString().replace(/\D/g, '')
      if (digits.length === 8) {
        this.fillAddressByCep()
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

    const { data } = await supabase
      .from('clients')
      .select()
      .eq('user_id', this.userId)

    if (data) {
      this.clients = data
    }
    await this.fetchStatesList()
    await this.fetchServicesList()
    await this.fetchRoomsList()
  }
}
</script>
