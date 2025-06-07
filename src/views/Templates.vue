<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8 space-y-6">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Templates" />

      <section class="bg-white p-6 rounded-lg shadow space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Templates</h3>
          <button @click="showTemplateModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Novo Template</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Nome</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in templates" :key="t.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ t.name }}</td>
              </tr>
              <tr v-if="templates.length === 0">
                <td class="px-4 py-6 text-center text-gray-500">Nenhum template</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Modal v-if="showTemplateModal" @close="closeTemplateModal">
        <h3 class="text-lg font-semibold mb-4">Novo Template</h3>
        <form @submit.prevent="handleAddTemplate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" v-model="templateForm.name" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Conteúdo</label>
            <textarea v-model="templateForm.content" class="w-full mt-1 px-4 py-2 border rounded-md" rows="4"></textarea>
            <p class="text-sm text-gray-500 mt-1" v-pre>Use {{client_name}} e {{appointments}}</p>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeTemplateModal" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
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

export default {
  name: 'Templates',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      sidebarOpen: true,
      templates: [],
      showTemplateModal: false,
      templateForm: { name: '', content: '' }
    }
  },
  methods: {
    closeTemplateModal() {
      this.showTemplateModal = false
      this.templateForm = { name: '', content: '' }
    },
    async handleAddTemplate() {
      const { data, error } = await supabase
        .from('receipt_templates')
        .insert({
          name: this.templateForm.name,
          content: this.templateForm.content,
          user_id: this.userId
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao salvar template: ' + error.message)
      } else {
        this.templates.push(data)
        this.closeTemplateModal()
      }
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
      return
    }
    this.userId = user.id

    const { data: templateData } = await supabase
      .from('receipt_templates')
      .select()
      .eq('user_id', this.userId)
    if (templateData) this.templates = templateData
  }
}
</script>
