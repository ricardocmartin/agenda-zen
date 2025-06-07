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
      <HeaderUser title="Salas" />

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Salas cadastradas</h3>
          <div class="flex items-center space-x-3">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="openModal"
              class="btn"
            >
              Nova Sala
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Nome</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="room in paginatedRooms"
                :key="room.id"
                class="border-b last:border-b-0"
              >
                <td class="px-4 py-2">{{ room.name }}</td>
                <td class="px-4 py-2 text-right">
                  <button
                    @click="handleDeleteRoom(room.id)"
                    class="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRooms.length === 0">
                <td colspan="2" class="px-4 py-6 text-center text-gray-500">
                  Nenhuma sala encontrada
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
        <h3 class="text-lg font-semibold mb-4">Adicionar Sala</h3>
        <form @submit.prevent="handleAddRoom" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="form.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="btn">Salvar</button>
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
  name: 'Salas',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      showModal: false,
      search: '',
      form: {
        name: ''
      },
      rooms: [],
      sidebarOpen: true,
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = { name: '' }
    },
    async handleAddRoom() {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: this.form.name,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar sala: ' + error.message)
      } else {
        this.rooms.push(data)
        this.closeModal()
      }
    },
    async handleDeleteRoom(id) {
      const confirmed = confirm('Tem certeza que deseja excluir esta sala?')
      if (!confirmed) return

      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Erro ao excluir sala: ' + error.message)
      } else {
        this.rooms = this.rooms.filter(r => r.id !== id)
      }
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    prevPage() {
      if (this.page > 1) this.page--
    }
  },
  computed: {
    filteredRooms() {
      const term = this.search.toLowerCase()
      return this.rooms.filter(r => r.name.toLowerCase().includes(term))
    },
    paginatedRooms() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredRooms.slice(start, start + this.pageSize)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRooms.length / this.pageSize))
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

    const { data } = await supabase
      .from('rooms')
      .select()
      .eq('user_id', this.userId)

    if (data) {
      this.rooms = data
    }
  }
}
</script>

