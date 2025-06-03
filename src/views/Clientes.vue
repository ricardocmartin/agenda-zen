<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-8">
      <HeaderUser title="Clientes" />
      <section>
        <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Novo Cliente</button>

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

        <div class="mt-8">
          <h3 class="text-lg font-medium mb-4">Clientes cadastrados</h3>
          <ul class="space-y-2">
            <li v-for="client in clients" :key="client.id" class="p-3 bg-white shadow rounded flex justify-between items-center">
              <span>
                <strong>{{ client.name }}</strong> - {{ client.email }} - {{ client.phone }}
              </span>
              <button @click="handleDeleteClient(client.id)" class="text-red-600 hover:underline">Excluir</button>
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
  name: 'Clientes',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      showModal: false,
      form: {
        name: '',
        email: '',
        phone: ''
      },
      clients: []
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
