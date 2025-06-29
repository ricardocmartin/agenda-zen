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
      <HeaderUser title="Serviços" />

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h3 class="text-lg font-medium">Serviços cadastrados</h3>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button
              @click="openModal()"
              class="btn w-full sm:w-auto"
            >
              Novo Serviço
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Nome</th>
                <th class="px-4 py-2 font-medium text-gray-700">Descrição</th>
                <th class="px-4 py-2 font-medium text-gray-700">Duração</th>
                <th class="px-4 py-2 font-medium text-gray-700">Valor</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="service in paginatedServices"
                :key="service.id"
                class="border-b last:border-b-0"
              >
                <td class="px-4 py-2">{{ service.name }}</td>
                <td class="px-4 py-2">{{ service.description }}</td>
                <td class="px-4 py-2">{{ service.duration }} minutos</td>
                <td class="px-4 py-2">{{ formatPrice(service.price) }}</td>
                <td class="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                  <button
                    @click="openModal(service, true)"
                    class="btn btn-sm btn-secondary"
                  >
                    Visualizar
                  </button>
                  <button
                    @click="openModal(service)"
                    class="btn btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    @click="handleDeleteService(service.id)"
                    class="btn btn-sm btn-danger"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="filteredServices.length === 0">
                <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                  Nenhum serviço encontrado
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

      <Modal v-if="showModal" @close="closeModal">
        <h3 class="text-lg font-semibold mb-4">{{ viewMode ? 'Visualizar Serviço' : (editingId ? 'Editar Serviço' : 'Adicionar Serviço') }}</h3>
        <form @submit.prevent="handleSaveService" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="form.name" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea v-model="form.description" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tempo de duração</label>
            <input type="text" v-model="form.duration" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Valor</label>
            <input type="number" step="0.01" v-model="form.price" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Agendável pelo site?</label>
            <select v-model="form.allowOnlineBooking" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">É pacote?</label>
            <select v-model="form.isPackage" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div v-if="form.isPackage">
            <label class="block text-sm font-medium text-gray-700">Quantidade de sessões</label>
            <input type="number" v-model="form.sessions" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Ativo?</label>
            <select v-model="form.active" :disabled="viewMode" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Ativo?</label>
            <select v-model="form.active" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Ativo?</label>
            <select v-model="form.active" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded border">{{ viewMode ? 'Fechar' : 'Cancelar' }}</button>
            <button v-if="viewMode" type="button" @click="enableEditing" class="btn">Editar</button>
            <button v-else type="submit" class="btn">Salvar</button>
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
import { getUserCompanyId, getCompanyUserIds } from '../utils/company'

export default {
  name: 'Servicos',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      showModal: false,
      editingId: null,
      viewMode: false,
      search: '',
      sidebarOpen: window.innerWidth >= 768,
      form: {
        name: '',
        description: '',
        duration: '',
        price: '',
        allowOnlineBooking: true,
        isPackage: false,
        sessions: null,
        active: true
      },
      services: [],
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    openModal(service, view = false) {
      this.viewMode = view
      if (service) {
        this.editingId = service.id
        this.form = {
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          allowOnlineBooking: service.allow_online_booking,
          isPackage: service.is_package,
          sessions: service.session_count,
          active: service.active
        }
      } else {
        this.editingId = null
        this.form = {
          name: '',
          description: '',
          duration: '',
          price: '',
          allowOnlineBooking: true,
          isPackage: false,
          sessions: null,
          active: true
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.viewMode = false
      this.form = {
        name: '',
        description: '',
        duration: '',
        price: '',
        allowOnlineBooking: true,
        isPackage: false,
        sessions: null,
        active: true
      }
      this.editingId = null
    },
    enableEditing() {
      this.viewMode = false
    },
    async handleSaveService() {
      let data, error
      if (this.editingId) {
        ;({ data, error } = await supabase
          .from('services')
          .update({
            name: this.form.name,
            description: this.form.description,
            duration: this.form.duration,
          price: parseFloat(this.form.price),
          allow_online_booking: this.form.allowOnlineBooking,
          is_package: this.form.isPackage,
          session_count: this.form.sessions,
          active: this.form.active
        })
          .eq('id', this.editingId)
          .select()
          .single())
      } else {
        ;({ data, error } = await supabase
          .from('services')
          .insert({
            name: this.form.name,
            description: this.form.description,
            duration: this.form.duration,
            price: parseFloat(this.form.price),
            allow_online_booking: this.form.allowOnlineBooking,
          is_package: this.form.isPackage,
          session_count: this.form.sessions,
          active: this.form.active,
          user_id: this.userId
        })
          .select()
          .single())
      }

      if (error) {
        alert('Erro ao salvar serviço: ' + error.message)
      } else {
        if (this.editingId) {
          const index = this.services.findIndex(s => s.id === this.editingId)
          if (index !== -1) this.services[index] = data
        } else {
          this.services.push(data)
        }
        this.closeModal()
      }
    },
    async handleDeleteService(id) {
      const confirmed = confirm('Tem certeza que deseja excluir este serviço?')
      if (!confirmed) return

      const { data: appts } = await supabase
        .from('appointments')
        .select('id')
        .eq('service_id', id)
        .limit(1)

      if (appts && appts.length) {
        const { error: updError } = await supabase
          .from('services')
          .update({ active: false })
          .eq('id', id)

        if (updError) {
          alert('Erro ao inativar serviço: ' + updError.message)
        } else {
          const idx = this.services.findIndex(s => s.id === id)
          if (idx !== -1) this.services[idx].active = false
          alert('Serviço inativado.')
        }
        return
      }

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Erro ao excluir serviço: ' + error.message)
      } else {
        this.services = this.services.filter(s => s.id !== id)
      }
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    prevPage() {
      if (this.page > 1) this.page--
    },
    formatPrice(value) {
      if (value === null || value === undefined || value === '') return ''
      return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  },
  computed: {
    filteredServices() {
      const term = this.search.toLowerCase()
      return this.services.filter(
        s =>
          s.name.toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term) ||
          (s.duration || '').toLowerCase().includes(term) ||
          (s.price !== null && s.price.toString().includes(term))
      )
    },
    paginatedServices() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredServices.slice(start, start + this.pageSize)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredServices.length / this.pageSize))
    }
  },
  watch: {
    search() {
      this.page = 1
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
      return
    }
    this.userId = user.id
    const companyId = await getUserCompanyId(this.userId)
    const userIds = companyId
      ? await getCompanyUserIds(companyId)
      : [this.userId]

    const { data } = await supabase
      .from('services')
      .select()
      .in('user_id', userIds)

    if (data) {
      this.services = data
    }
  }
}
</script>

