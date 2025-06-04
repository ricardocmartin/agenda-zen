<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8 space-y-6">
      <div class="md:hidden flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <HeaderUser title="Clientes" />

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Clientes cadastrados</h3>
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
                v-for="client in filteredClients"
                :key="client.id"
                class="border-b last:border-b-0"
              >
                <td class="px-4 py-2">{{ client.name }}</td>
                <td class="px-4 py-2">{{ client.email }}</td>
                <td class="px-4 py-2">{{ client.phone }}</td>
                <td class="px-4 py-2 text-right space-x-2">
                  <a
                    :href="whatsappLink(client.phone)"
                    target="_blank"
                    rel="noopener"
                    class="text-green-600 hover:underline"
                  >
                    WhatsApp
                  </a>
                  <button
                    @click="handleDeleteClient(client.id)"
                    class="text-red-600 hover:underline"
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
        </div>
      </section>

      <Modal v-if="showModal" @close="closeModal">
        <h3 class="text-lg font-semibold mb-4">Adicionar Cliente</h3>
        <form @submit.prevent="handleAddClient" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="form.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" v-model="form.email" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="text" v-model="form.phone" class="w-full mt-1 px-4 py-2 border rounded-md" />
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
  name: 'Clientes',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      showModal: false,
      search: '',
      form: {
        name: '',
        email: '',
        phone: ''
      },
      clients: [],
      sidebarOpen: false
    }
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = { name: '', email: '', phone: '' }
    },
    formatPhone(phone) {
      return phone.replace(/[^\d]/g, '')
    },
    whatsappLink(phone) {
      const formatted = this.formatPhone(phone)
      return `https://wa.me/${formatted}`
    },
    async handleAddClient() {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar cliente: ' + error.message)
      } else {
        this.clients.push(data)
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
    }
  },
  computed: {
    filteredClients() {
      const term = this.search.toLowerCase()
      return this.clients.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term)
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
      .from('clients')
      .select()
      .eq('user_id', this.userId)

    if (data) {
      this.clients = data
    }
  }
}
</script>
