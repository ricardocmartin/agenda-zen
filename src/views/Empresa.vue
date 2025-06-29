<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-8">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Empresa" />
      <form @submit.prevent="handleSave" class="bg-white p-4 rounded shadow space-y-4 max-w-xl">
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700">Nome da Empresa</label>
          <input id="companyName" v-model="form.name" type="text" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">Telefone</label>
          <input id="phone" v-model="form.phone" type="text" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
          <input id="email" v-model="form.email" type="email" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">Endereço</label>
          <input id="address" v-model="form.address" type="text" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div class="text-right">
          <button type="submit" class="btn">Salvar</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import { supabase } from '../supabase'

export default {
  name: 'Empresa',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      companyId: null,
      form: { name: '', phone: '', email: '', address: '' }
    }
  },
  methods: {
    async fetchCompany() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        this.$router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()
      if (profile && profile.company_id) {
        this.companyId = profile.company_id
        const { data: company } = await supabase
          .from('companies')
          .select('name, phone, email, address')
          .eq('id', this.companyId)
          .single()
        if (company) {
          this.form = {
            name: company.name || '',
            phone: company.phone || '',
            email: company.email || '',
            address: company.address || ''
          }
        }
      }
    },
    async handleSave() {
      if (!this.companyId) {
        const { data: company, error } = await supabase
          .from('companies')
          .insert({
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
            address: this.form.address
          })
          .select('id')
          .single()
        if (error) {
          alert('Erro ao salvar dados: ' + error.message)
          return
        }
        this.companyId = company.id
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('profiles')
            .update({ company_id: this.companyId })
            .eq('id', user.id)
        }
        alert('Dados salvos com sucesso!')
        return
      }
      const { error } = await supabase
        .from('companies')
        .update({
          name: this.form.name,
          phone: this.form.phone,
          email: this.form.email,
          address: this.form.address
        })
        .eq('id', this.companyId)
      if (error) {
        alert('Erro ao salvar dados: ' + error.message)
      } else {
        alert('Dados salvos com sucesso!')
      }
    }
  },
  async mounted() {
    await this.fetchCompany()
  }
}
</script>
