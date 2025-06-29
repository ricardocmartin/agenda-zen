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
      <HeaderUser title="Permissões" />
      <section class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Cadastrar permissão</h3>
        <form @submit.prevent="addPermission" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Usuário</label>
            <select v-model="form.profileId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option value="" disabled>Selecione</option>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.email }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tela</label>
            <input type="text" v-model="form.screen" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div class="flex items-center">
            <input type="checkbox" v-model="form.canView" id="canView" class="mr-2" />
            <label for="canView">Pode visualizar</label>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn">Salvar</button>
          </div>
        </form>
      </section>

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Permissões cadastradas</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Usuário</th>
                <th class="px-4 py-2 font-medium text-gray-700">Tela</th>
                <th class="px-4 py-2 font-medium text-gray-700">Pode ver</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in permissions" :key="p.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ getUserEmail(p.profile_id) }}</td>
                <td class="px-4 py-2">{{ p.screen }}</td>
                <td class="px-4 py-2">{{ p.can_view ? 'Sim' : 'Não' }}</td>
              </tr>
              <tr v-if="permissions.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500">Nenhuma permissão</td>
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
  name: 'Permissoes',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      users: [],
      permissions: [],
      form: { profileId: '', screen: '', canView: true },
      userId: null
    }
  },
  methods: {
    async fetchUsers() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', this.userId)
        .single()
      if (profile) {
        const { data } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('company_id', profile.company_id)
        this.users = data || []
      }
    },
    async fetchPermissions() {
      const { data } = await supabase.from('screen_permissions').select('*')
      this.permissions = data || []
    },
    async addPermission() {
      if (!this.form.profileId || !this.form.screen) return
      await supabase.from('screen_permissions').insert({
        profile_id: this.form.profileId,
        screen: this.form.screen,
        can_view: this.form.canView
      })
      this.form = { profileId: '', screen: '', canView: true }
      await this.fetchPermissions()
    },
    getUserEmail(id) {
      const u = this.users.find(x => x.id === id)
      return u ? u.email : id
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
    await this.fetchPermissions()
  }
}
</script>
