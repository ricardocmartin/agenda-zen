<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1" for="name">Nome</label>
          <input v-model="name" type="text" id="name" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1" for="email">E-mail</label>
          <input v-model="email" type="email" id="email" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-1" for="password">Senha</label>
          <input v-model="password" type="password" id="password" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Cadastrar</button>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Signup',
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    handleSignup() {
      console.log('Cadastro:', this.name, this.email, this.password)
    }
  }
}
</script>