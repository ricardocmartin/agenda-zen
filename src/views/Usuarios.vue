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
      <section class="bg-white p-4 rounded-lg shadow">
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

      <section class="bg-white p-4 rounded-lg shadow">
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
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredUsers" :key="u.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ u.id }}</td>
                <td class="px-4 py-2">{{ u.email }}</td>
                <td class="px-4 py-2 text-right">
                  <button @click="openUserModal(u, 'view')" class="btn btn-sm">Visualizar</button>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500">Nenhum usuário encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <Modal v-if="showUserModal" @close="handleUserClose">
        <h3 class="text-lg font-semibold mb-4">
          {{ userModalMode === 'new' ? 'Adicionar Usuário' : 'Cadastro de Usuário' }}
        </h3>
        <form @submit.prevent="handleSaveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" v-model="userForm.email" :disabled="isUserView" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" v-model="userForm.password" :disabled="isUserView" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="handleUserClose" class="px-4 py-2 rounded border">Fechar</button>
            <button v-if="userModalMode === 'view'" type="button" @click="enableUserEdit" class="btn btn-success">Editar</button>
            <button type="submit" class="btn" :disabled="isUserView">Salvar</button>
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
import { isValidEmail } from '../utils/format'

export default {
  name: 'Usuarios',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      sidebarOpen: window.innerWidth >= 768,
      userId: null,
      successMessage: '',
      errorMessage: '',
      users: [],
      search: '',
      showUserModal: false,
      userModalMode: 'new',
      selectedUserId: null,
      userForm: { email: '', password: '' }
    }
  },
  methods: {
    async handleAddUser() {
      this.successMessage = ''
      this.errorMessage = ''

      if (this.form.email && !isValidEmail(this.form.email)) {
        this.errorMessage = 'E-mail inválido'
        return
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      let profileData = null
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('company_id')
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
            company_id: profileData.company_id
          })
        }
        this.successMessage = 'Usuário cadastrado! Verifique o e-mail para ativar a conta.'
        this.form = { email: '', password: '' }
        await this.fetchUsers()
      }
    },
    openUserModal(user, mode = 'new') {
      this.userModalMode = mode
      if (user) {
        this.selectedUserId = user.id
        this.userForm = { email: user.email, password: '' }
      } else {
        this.selectedUserId = null
        this.userForm = { email: '', password: '' }
      }
      this.showUserModal = true
    },
    handleUserClose() {
      if (this.userModalMode === 'view') {
        this.closeUserModal()
      } else {
        if (confirm('Tem certeza? Os dados não foram salvos e serão perdidos.')) {
          this.closeUserModal()
        }
      }
    },
    closeUserModal() {
      this.showUserModal = false
      this.userModalMode = 'new'
      this.selectedUserId = null
      this.userForm = { email: '', password: '' }
    },
    enableUserEdit() {
      this.userModalMode = 'edit'
    },
    async handleSaveUser() {
      if (this.userModalMode === 'view') return
      if (this.userForm.email && !isValidEmail(this.userForm.email)) {
        alert('E-mail inválido')
        return
      }
      if (this.selectedUserId) {
        const { error } = await supabase
          .from('profiles')
          .update({ email: this.userForm.email })
          .eq('id', this.selectedUserId)
        if (error) {
          alert('Erro ao salvar usuário: ' + error.message)
        } else {
          const index = this.users.findIndex(u => u.id === this.selectedUserId)
          if (index !== -1) this.users[index].email = this.userForm.email
          this.closeUserModal()
        }
      } else {
        this.form = { email: this.userForm.email, password: this.userForm.password }
        await this.handleAddUser()
        this.closeUserModal()
      }
    },
    async fetchUsers() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', this.userId)
        .single()

      if (profile) {
        let query = supabase
          .from('profiles')
          .select('id, email')

        if (profile.company_id === null) {
          query = query.is('company_id', null)
        } else {
          query = query.eq('company_id', profile.company_id)
        }

        const { data } = await query
        this.users = data || []
      }
    }
  },
  computed: {
    isUserView() {
      return this.userModalMode === 'view'
    },
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
