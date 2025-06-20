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
      <HeaderUser title="Comprovantes" />


      <section class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Comprovantes Gerados</h3>
          <button @click="showGenerateModal = true" class="btn">Novo Comprovante</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Cliente</th>
                <th class="px-4 py-2 font-medium text-gray-700">Período</th>
                <th class="px-4 py-2 font-medium text-gray-700">Criado em</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in receipts" :key="r.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ getClientName(r.client_id) }}</td>
                <td class="px-4 py-2">{{ formatDateBR(r.start_date) }} - {{ formatDateBR(r.end_date) }}</td>
                <td class="px-4 py-2">{{ formatDateBR(r.created_at.split('T')[0]) }}</td>
                <td class="px-4 py-2 text-right">
                  <button @click="showReceipt(r.content)" class="btn btn-sm">Ver</button>
                </td>
              </tr>
              <tr v-if="receipts.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">Nenhum comprovante</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>


      <Modal v-if="showGenerateModal" @close="closeGenerateModal">
        <h3 class="text-lg font-semibold mb-4">Novo Comprovante</h3>
        <form @submit.prevent="handleGenerate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="generateForm.clientId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">De</label>
              <input type="date" v-model="generateForm.startDate" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Até</label>
              <input type="date" v-model="generateForm.endDate" class="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Template</label>
            <select v-model="generateForm.templateId" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeGenerateModal" class="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" class="btn">Gerar</button>
          </div>
        </form>
      </Modal>

      <Modal v-if="receiptContent" @close="receiptContent = null">
        <h3 class="text-lg font-semibold text-center mb-4">Comprovante</h3>
        <div class="border rounded-md p-4 bg-gray-50">
          <pre class="whitespace-pre-wrap font-mono text-sm">{{ receiptContent }}</pre>
        </div>
      </Modal>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import Modal from '../components/Modal.vue'
import { supabase } from '../supabase'
import { formatDateBR } from '../utils/format'

export default {
  name: 'Comprovantes',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      userId: null,
      sidebarOpen: window.innerWidth >= 768,
      templates: [],
      receipts: [],
      clients: [],
      showGenerateModal: false,
      generateForm: { clientId: '', startDate: '', endDate: '', templateId: '' },
      receiptContent: null
    }
  },
  methods: {
    formatDateBR,
    closeGenerateModal() {
      this.showGenerateModal = false
      this.generateForm = { clientId: '', startDate: '', endDate: '', templateId: '' }
    },
    getClientName(id) {
      const c = this.clients.find(cl => cl.id === id)
      return c ? c.name : ''
    },
    showReceipt(content) {
      this.receiptContent = content
    },
    async handleGenerate() {
      const { data: appointments } = await supabase
        .from('appointments')
        .select()
        .eq('user_id', this.userId)
        .eq('client_id', this.generateForm.clientId)
        .gte('date', this.generateForm.startDate)
        .lte('date', this.generateForm.endDate)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      const template = this.templates.find(t => t.id === this.generateForm.templateId)
      const client = this.clients.find(c => c.id === this.generateForm.clientId)
      let content = template ? template.content : ''
      if (client) content = content.replace('{{client_name}}', client.name)
      const list = (appointments || [])
        .map(a => `- ${formatDateBR(a.date)} ${a.time}`)
        .join('\n')
      content = content.replace('{{appointments}}', list)

      const { data, error } = await supabase
        .from('receipts')
        .insert({
          user_id: this.userId,
          client_id: this.generateForm.clientId,
          template_id: this.generateForm.templateId,
          start_date: this.generateForm.startDate,
          end_date: this.generateForm.endDate,
          content
        })
        .select()
        .single()

      if (error) {
        alert('Erro ao gerar comprovante: ' + error.message)
      } else {
        this.receipts.push(data)
        this.closeGenerateModal()
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

    const { data: clientData } = await supabase
      .from('clients')
      .select()
      .eq('user_id', this.userId)

    if (clientData) this.clients = clientData

    const { data: templateData } = await supabase
      .from('receipt_templates')
      .select()
      .eq('user_id', this.userId)
    if (templateData) this.templates = templateData

    const { data: receiptData } = await supabase
      .from('receipts')
      .select()
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (receiptData) this.receipts = receiptData
  }
}
</script>
