<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-8">
      <HeaderUser title="Clientes" />
      <section>
        <form @submit.prevent="handleAddClient" class="space-y-6 max-w-lg">
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
          <div>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
          </div>
        </form>

        <div class="mt-8">
          <h3 class="text-lg font-medium mb-4">Clientes cadastrados</h3>
          <ul class="space-y-2">
            <li v-for="client in clients" :key="client.id" class="p-3 bg-white shadow rounded">
              <strong>{{ client.name }}</strong> - {{ client.email }} - {{ client.phone }}
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
import { supabase } from '../supabase'

export default {
  name: 'Clientes',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      userId: null,
      form: {
        name: '',
        email: '',
        phone: ''
      },
      clients: []
    }
  },
  methods: {
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
        this.form = { name: '', email: '', phone: '' }
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
