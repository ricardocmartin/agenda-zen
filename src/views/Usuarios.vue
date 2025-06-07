<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-8 space-y-6">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Usuários" />
      <section class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Cadastrar novo usuário</h3>
        <form @submit.prevent="handleAddUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" v-model="form.email" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" v-model="form.password" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn">Cadastrar</button>
          </div>
        </form>
        <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Usuários cadastrados</h3>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar..."
            class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">ID</th>
                <th class="px-4 py-2 font-medium text-gray-700">E-mail</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredUsers" :key="u.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ u.id }}</td>
                <td class="px-4 py-2">{{ u.email }}</td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="2" class="px-4 py-6 text-center text-gray-500">Nenhum usuário encontrado</td>
              </tr>
            </tbody>
          </table>
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
  name: 'Usuarios',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      sidebarOpen: true,
      userId: null,
      successMessage: '',
      errorMessage: '',
      users: [],
      search: ''
    }
  },
  methods: {
    async handleAddUser() {
      this.successMessage = ''
      this.errorMessage = ''

      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      let profileData = null
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        profileData = data
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: this.form.email,
        password: this.form.password
      })

      if (currentSession) {
        await supabase.auth.setSession(currentSession)
      }

      if (error) {
        this.errorMessage = 'Erro ao cadastrar usuário: ' + error.message
      } else {
        if (signUpData?.user && profileData) {
          await supabase.from('profiles').insert({
            id: signUpData.user.id,
            business_name: profileData.business_name,
            description: profileData.description,
            phone: profileData.phone,
            whatsapp: profileData.whatsapp,
            email: profileData.email,
            address: profileData.address,
            instagram: profileData.instagram,
            facebook: profileData.facebook,
            youtube: profileData.youtube,
            x: profileData.x,
            slug: profileData.slug
          })
        }
        this.successMessage = 'Usuário cadastrado! Verifique o e-mail para ativar a conta.'
        this.form = { email: '', password: '' }
        await this.fetchUsers()
      }
    },
    async fetchUsers() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('slug')
        .eq('id', this.userId)
        .single()

      if (profile) {
        const { data } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('slug', profile.slug)

        this.users = data || []
      }
    }
  },
  computed: {
    filteredUsers() {
      const term = this.search.toLowerCase()
      return this.users.filter(
        u =>
          u.id.toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term)
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
    await this.fetchUsers()
  }
}
</script>
