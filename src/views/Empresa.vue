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
          <label class="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            v-model="form.phone"
            @input="form.phone = phoneMask(form.phone)"
            type="text"
            class="w-full mt-1 px-4 py-2 border rounded-md"
          />
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
import { phoneMask } from '../utils/phone'
import { isValidEmail } from '../utils/format'

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
    phoneMask,
    async fetchCompany() {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()
      console.log('fetchCompany - user', user, userError)
      if (!user) {
        this.$router.push('/login')
        return
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()
      console.log('fetchCompany - profile', profile, profileError)
      if (profile && profile.company_id) {
        this.companyId = profile.company_id
        console.log('fetchCompany - companyId', this.companyId)
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('name, phone, email, address')
          .eq('id', this.companyId)
          .single()
        console.log('fetchCompany - company', company, companyError)
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
      if (this.form.email && !isValidEmail(this.form.email)) {
        alert('E-mail inválido')
        return
      }
      if (!this.companyId) {
        const newId = crypto.randomUUID()
        const { error } = await supabase
          .from('companies')
          .insert({
            id: newId,
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
            address: this.form.address
          })
        if (error) {
          alert('Erro ao salvar dados: ' + error.message)
          return
        }
        this.companyId = newId
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
