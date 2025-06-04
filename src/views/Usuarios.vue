<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-8 space-y-6">
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
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Cadastrar</button>
          </div>
        </form>
        <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
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
      successMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleAddUser() {
      this.successMessage = ''
      this.errorMessage = ''
      const { error } = await supabase.auth.signUp({
        email: this.form.email,
        password: this.form.password
      })

      if (error) {
        this.errorMessage = 'Erro ao cadastrar usuário: ' + error.message
      } else {
        this.successMessage = 'Usuário cadastrado! Verifique o e-mail para ativar a conta.'
        this.form = { email: '', password: '' }
      }
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
    }
  }
}
</script>
