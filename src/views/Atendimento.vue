<template>
  <div class="min-h-screen flex bg-gray-100 relative">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 p-4 md:p-8">
      <div v-if="!sidebarOpen" class="flex items-center mb-4">
        <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <HeaderUser title="Atendimento" />
      <section class="bg-white p-4 rounded-lg shadow mt-4">
        <div class="border-b mb-4">
          <nav class="flex space-x-4">
            <button :class="activeTab === 'current' ? 'border-b-2 border-blue-500 pb-2' : 'text-gray-500 pb-2'" @click="activeTab = 'current'">Atendimento</button>
            <button :class="activeTab === 'history' ? 'border-b-2 border-blue-500 pb-2' : 'text-gray-500 pb-2'" @click="activeTab = 'history'">Histórico de atendimento</button>
          </nav>
        </div>
        <div v-if="activeTab === 'current'">
          <p class="mb-2 text-sm text-gray-600">Data/hora: {{ appointmentDateTime }}</p>
          <textarea v-model="note" class="w-full border rounded p-2 mb-4" rows="6" placeholder="Descreva o atendimento"></textarea>
          <input type="file" multiple @change="handleFileChange" class="mb-4" accept=".pdf,.doc,.txt,.png,.jpeg" />
          <button @click="saveNote" class="btn">Salvar</button>
        </div>
        <div v-else>
          <div v-for="group in groupedNotes" :key="group.date" class="mb-4">
            <h4 class="font-semibold mb-2">{{ group.date }}</h4>
            <div v-for="n in group.items" :key="n.id" class="border p-2 rounded mb-2">
              <p class="text-sm text-gray-600 mb-1">{{ formatDateTime(n.created_at) }}</p>
              <p class="mb-2 whitespace-pre-line">{{ n.note }}</p>
              <div v-if="n.attachments && n.attachments.length" class="space-x-2">
                <a v-for="(url, idx) in n.attachments" :key="idx" :href="url" target="_blank" class="text-blue-600 underline">Anexo {{ idx + 1 }}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import { supabase } from '../supabase'
import { formatDateBR } from '../utils/format'

export default {
  name: 'Atendimento',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      activeTab: 'current',
      appointment: null,
      note: '',
      files: [] ,
      notes: [],
      userId: null
    }
  },
  computed: {
    appointmentDateTime() {
      if (!this.appointment) return ''
      return `${formatDateBR(this.appointment.date)} ${this.appointment.time}`
    },
    groupedNotes() {
      const groups = {}
      this.notes.forEach(n => {
        const d = n.created_at.split('T')[0]
        if (!groups[d]) groups[d] = []
        groups[d].push(n)
      })
      return Object.keys(groups)
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => ({ date: formatDateBR(date), items: groups[date] }))
    }
  },
  methods: {
    formatDateTime(dt) {
      return new Date(dt).toLocaleString('pt-BR')
    },
    handleFileChange(e) {
      const allowed = ['pdf', 'doc', 'txt', 'png', 'jpeg']
      const selected = Array.from(e.target.files)
      this.files = []
      for (const file of selected) {
        const ext = file.name.split('.').pop().toLowerCase()
        if (allowed.includes(ext)) {
          this.files.push(file)
        } else {
          alert(`Formato de arquivo não permitido: ${file.name}`)
        }
      }
    },
    async fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        this.$router.push('/login')
        return
      }
      this.userId = user.id
      const { data: appt } = await supabase
        .from('appointments')
        .select()
        .eq('id', this.$route.params.id)
        .single()
      this.appointment = appt
      const { data: notes } = await supabase
        .from('appointment_notes')
        .select()
        .eq('appointment_id', this.$route.params.id)
        .order('created_at', { ascending: false })
      this.notes = notes || []
    },
    async saveNote() {
      if (!this.note.trim() && !this.files.length) return
      const attachmentUrls = []
      for (const file of this.files) {
        const ext = file.name.split('.').pop()
        const fileName = `${this.$route.params.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('appointment-attachments').upload(fileName, file)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('appointment-attachments').getPublicUrl(fileName)
          attachmentUrls.push(publicUrl)
        }
      }
      const { data, error } = await supabase
        .from('appointment_notes')
        .insert({
          appointment_id: this.$route.params.id,
          user_id: this.userId,
          note: this.note,
          attachments: attachmentUrls
        })
        .select()
        .single()
      if (!error) {
        this.notes.unshift(data)
        this.note = ''
        this.files = []
      } else {
        alert('Erro ao salvar atendimento: ' + error.message)
      }
    }
  },
  async mounted() {
    await this.fetchData()
  }
}
</script>
