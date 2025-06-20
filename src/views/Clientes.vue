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
                <td class="px-4 py-2">{{ client.name }}</td>
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
          <form @submit.prevent="handleSaveClient" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div class="flex justify-end space-x-2 md:col-span-2">
            <button type="button" @click="handleClose" class="px-4 py-2 rounded border">Fechar</button>
            <button v-if="modalMode === 'view'" type="button" @click="enableEdit" class="btn btn-success">Editar</button>
            <button type="submit" class="btn" :disabled="isReadOnly">Salvar</button>
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
import { phoneMask, digitsOnly } from '../utils/phone'
import { fetchStates, fetchCities } from '../utils/locations'
import { cpfMask, cepMask, isValidEmail } from '../utils/format'

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
          cityId: ''
        },
        states: [],
        cities: [],
        clients: [],
        sidebarOpen: window.innerWidth >= 768,
        page: 1,
        pageSize: 10
    }
  },
  methods: {
    phoneMask,
    digitsOnly,
    cpfMask,
    cepMask,
    async fetchStatesList() {
      this.states = await fetchStates()
    },
    async fetchCitiesList() {
      this.cities = await fetchCities(this.form.stateId)
    },
    async openModal(client, mode = 'new') {
      this.modalMode = mode
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
          cityId: client.city_id
        }
      } else {
        this.editingId = null
        this.form = { name: '', email: '', phone: '', birthdate: '', cpf: '', cep: '', street: '', number: '', complement: '', neighborhood: '', stateId: '', cityId: '' }
      }
      await this.fetchStatesList()
      if (this.form.stateId) {
        await this.fetchCitiesList()
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalMode = 'new'
      this.editingId = null
      this.form = { name: '', email: '', phone: '', birthdate: '', cpf: '', cep: '', street: '', number: '', complement: '', neighborhood: '', stateId: '', cityId: '' }
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
            city_id: this.form.cityId
          })
          .eq('id', this.editingId)
          .select()
          .single())
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
            user_id: this.userId
          })
          .select()
          .single())
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
      }
    },
    async handleDeleteClient(id) {
      const confirmed = confirm('Tem certeza que deseja excluir este cliente?')
      if (!confirmed) return

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
  }
}
</script>
