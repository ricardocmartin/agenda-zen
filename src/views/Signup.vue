<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-extrabold text-blue-700">Crie sua conta</h2>
        <p class="text-gray-500">Comece agora a organizar seus atendimentos com praticidade</p>
      </div>
      <form @submit.prevent="handleSignup" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">E-mail</label>
          <input v-model="email" type="email" id="email" placeholder="seu@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Senha</label>
          <input v-model="password" type="password" id="password" placeholder="********" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="color">Cor do perfil</label>
          <input v-model="color" type="color" id="color" class="w-16 h-10 border border-gray-300 rounded-md">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="avatar">Imagem do perfil</label>
          <input type="file" id="avatar" accept="image/*" capture="user" @change="handleFileUpload">
          <img v-if="previewUrl" :src="previewUrl" alt="Pré-visualização" class="mt-2 w-24 h-24 object-cover rounded-full">
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">Cadastrar</button>
      </form>
      <p class="mt-6 text-center text-sm text-gray-500">
        Já tem uma conta? <router-link to="/login" class="text-blue-600 hover:underline">Entrar</router-link>
      </p>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'Signup',
  data() {
    return {
      email: '',
      password: '',
      color: '#000000',
      avatarFile: null,
      previewUrl: null
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.avatarFile = file
        this.previewUrl = URL.createObjectURL(file)
      } else {
        this.avatarFile = null
        this.previewUrl = null
      }
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    async handleSignup() {
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password
      })

      if (error) {
        alert('Erro ao cadastrar: ' + error.message)
      } else {
        let avatarData = null
        if (this.avatarFile) {
          avatarData = await this.toBase64(this.avatarFile)
        }
        if (data?.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            color: this.color,
            avatar_url: avatarData
          })
        }
        alert('Cadastro realizado! Verifique seu e-mail para ativar a conta.')
      }
    }
  }
}
</script>