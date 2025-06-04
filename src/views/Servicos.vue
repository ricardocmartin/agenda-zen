<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-8 space-y-6">
      <HeaderUser title="Serviços" />

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Serviços cadastrados</h3>
          <div class="flex items-center space-x-3">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="openModal"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="service in filteredServices"
                :key="service.id"
                class="border-b last:border-b-0"
              >
                <td class="px-4 py-2">{{ service.name }}</td>
                <td class="px-4 py-2">{{ service.description }}</td>
                <td class="px-4 py-2">{{ service.duration }}</td>
                <td class="px-4 py-2 text-right">
                  <button
                    @click="handleDeleteService(service.id)"
                    class="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="filteredServices.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Nenhum serviço encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Modal v-if="showModal" @close="closeModal">
        <h3 class="text-lg font-semibold mb-4">Adicionar Serviço</h3>
        <form @submit.prevent="handleAddService" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="form.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea v-model="form.description" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tempo de duração</label>
            <input type="text" v-model="form.duration" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
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
  name: 'Servicos',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      showModal: false,
      search: '',
      form: {
        name: '',
        description: '',
        duration: ''
      },
      services: []
    }
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = { name: '', description: '', duration: '' }
    },
    async handleAddService() {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: this.form.name,
          description: this.form.description,
          duration: this.form.duration,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar serviço: ' + error.message)
      } else {
        this.services.push(data)
        this.closeModal()
      }
    },
    async handleDeleteService(id) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Erro ao excluir serviço: ' + error.message)
      } else {
        this.services = this.services.filter(s => s.id !== id)
      }
    }
  },
  computed: {
    filteredServices() {
      const term = this.search.toLowerCase()
      return this.services.filter(
        s =>
          s.name.toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term) ||
          (s.duration || '').toLowerCase().includes(term)
      )
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
      .from('services')
      .select()
      .eq('user_id', this.userId)

    if (data) {
      this.services = data
    }
  }
}
</script>

