<template>
  <div class="min-h-screen flex bg-gray-100">
    <Sidebar />

    <main class="flex-1 p-8">
      <HeaderUser title="Clientes" />

      <div>
        <table class="min-w-full bg-white border" v-if="clientes.length">
          <thead>
            <tr>
              <th class="px-4 py-2 border">Nome</th>
              <th class="px-4 py-2 border">Email</th>
              <th class="px-4 py-2 border">Telefone</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientes" :key="cliente.id">
              <td class="px-4 py-2 border">{{ cliente.name }}</td>
              <td class="px-4 py-2 border">{{ cliente.email }}</td>
              <td class="px-4 py-2 border">{{ cliente.phone }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-gray-500">Nenhum cliente encontrado.</p>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import { supabase } from '../supabase'

export default {
  name: 'ClientesList',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      clientes: []
    }
  },
  async mounted() {
    const { data, error } = await supabase
      .from('clients')
      .select()

    if (!error) {
      this.clientes = data || []
    } else {
      console.error('Erro ao carregar clientes:', error.message)
    }
  }
}
</script>
