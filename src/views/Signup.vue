<template>
  <Navbar />
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-extrabold text-blue-700">Crie sua conta</h2>
        <p class="text-gray-500">Comece agora a organizar seus atendimentos com praticidade</p>
      </div>
        <form @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="name">Nome</label>
            <input v-model="name" type="text" id="name" placeholder="Seu nome" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">E-mail</label>
            <input v-model="email" type="email" id="email" placeholder="seu@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Senha</label>
            <input v-model="password" type="password" id="password" placeholder="********" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="company">Empresa</label>
            <input v-model="company" type="text" id="company" placeholder="Nome da empresa" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        <button type="submit" class="btn w-full">Cadastrar</button>
      </form>
      <p class="mt-6 text-center text-sm text-gray-500">
        Já tem uma conta? <router-link to="/login" class="text-blue-600 hover:underline">Entrar</router-link>
      </p>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { supabase } from '../supabase'
import { isValidEmail } from '../utils/format'

export default {
  name: 'Signup',
  components: { Navbar, Footer },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      company: ''
    }
  },
  methods: {
    async handleSignup() {
      if (!this.name) {
        alert('Informe o nome')
        return
      }
      if (!this.company) {
        alert('Informe a empresa')
        return
      }
      if (this.email && !isValidEmail(this.email)) {
        alert('E-mail inválido')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: { name: this.name, display_name: this.name }
        }
      })

      if (error) {
        alert('Erro ao cadastrar: ' + error.message)
      } else {
        if (data?.session) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .insert({ name: this.company })
            .select('id')
            .single()

          if (companyError) {
            alert('Erro ao criar empresa: ' + companyError.message)
            return
          }

          await supabase.from('profiles').insert({
            id: data.user.id,
            company_id: companyData.id
          })
          alert('Cadastro realizado!')
        } else {
          alert('Cadastro realizado! Verifique seu e-mail para ativar a conta e depois associe a empresa.')
        }
      }
    }
  }
}
</script>