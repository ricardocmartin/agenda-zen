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
          <div v-if="isEditing && editingAttachments.length" class="mb-4 space-y-1">
            <div v-for="(url, index) in editingAttachments" :key="index" class="flex items-center space-x-2">
              <a :href="url" target="_blank" download class="text-blue-600 underline">Anexo {{ index + 1 }}</a>
              <button type="button" @click="removeAttachment(index)" class="text-red-600 text-sm">Remover</button>
            </div>
          </div>
          <input type="file" multiple @change="handleFileChange" class="mb-4" accept=".pdf,.doc,.txt,.png,.jpeg,.jpg" />
          <div class="space-x-2">
            <button @click="saveNote" class="btn">{{ isEditing ? 'Atualizar' : 'Finalizar atendimento' }}</button>
            <button v-if="isEditing" @click="cancelEdit" class="btn btn-danger">Cancelar</button>
          </div>
        </div>
        <div v-else>
          <div v-for="group in groupedNotes" :key="group.date" class="mb-4">
            <h4 class="font-semibold mb-2">{{ group.date }}</h4>
              <div v-for="n in group.items" :key="n.id" class="border p-2 rounded mb-2">
                <p class="text-sm text-gray-600 mb-1">{{ formatDateTime(n.created_at) }}</p>
                <p class="mb-2 whitespace-pre-line">{{ n.note }}</p>
                <div v-if="n.attachments && n.attachments.length" class="space-x-2 mb-2">
                  <a v-for="(url, idx) in n.attachments" :key="idx" :href="url" target="_blank" download class="text-blue-600 underline">Anexo {{ idx + 1 }}</a>
                </div>
                <div class="text-right">
                  <button @click="editExistingNote(n)" class="btn btn-sm">Editar atendimento</button>
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
import { addHoursToTime } from '../utils/datetime'

export default {
  name: 'Atendimento',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      activeTab: 'current',
      appointment: null,
      note: '',
      files: [],
      notes: [],
      userId: null,
      isEditing: false,
      editingNoteId: null,
      editingAttachments: []
    }
  },
  computed: {
    appointmentDateTime() {
      if (!this.appointment) return ''
      return `${formatDateBR(this.appointment.date)} ${addHoursToTime(this.appointment.time)}`
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
      const allowed = ['pdf', 'doc', 'txt', 'png', 'jpeg', 'jpg']
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
    editExistingNote(note, switchTab = true) {
      if ((this.note && this.note.trim()) || this.files.length) {
        const confirmed = confirm('Dados não salvos serão perdidos. Deseja continuar?')
        if (!confirmed) return
      }
      this.isEditing = true
      this.editingNoteId = note.id
      this.editingAttachments = [...(note.attachments || [])]
      this.note = note.note
      this.files = []
      if (switchTab) {
        this.activeTab = 'current'
      }
    },
    cancelEdit() {
      this.isEditing = false
      this.editingNoteId = null
      this.editingAttachments = []
      this.note = ''
      this.files = []
    },
    async removeAttachment(index) {
      const confirmed = confirm('Remover este anexo?')
      if (!confirmed) return
      const url = this.editingAttachments[index]
      const parts = url.split('/appointment-attachments/')
      if (parts.length === 2) {
        const path = parts[1]
        await supabase.storage.from('appointment-attachments').remove([path])
      }
      this.editingAttachments.splice(index, 1)
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

      let appointmentIds = [this.$route.params.id]
      if (appt) {
        const { data: clientAppointments } = await supabase
          .from('appointments')
          .select('id')
          .eq('user_id', this.userId)
          .eq('client_id', appt.client_id)
        appointmentIds = clientAppointments ? clientAppointments.map(a => a.id) : appointmentIds
      }

      const { data: notes } = await supabase
        .from('appointment_notes')
        .select()
        .in('appointment_id', appointmentIds)
        .order('created_at', { ascending: false })
      this.notes = (notes || []).map(n => ({
        ...n,
        attachments: n.attachments || []
      }))
      const noteParam = this.$route.query.note
      if (noteParam) {
        const toEdit = this.notes.find(n => n.id === Number(noteParam) || n.id === noteParam)
        if (toEdit) {
          this.editExistingNote(toEdit)
        }
      }
    },
   async saveNote() {
      if (!this.note.trim() && !this.files.length && !this.editingAttachments.length) return
      const wasEditing = this.isEditing

      const uploadedUrls = []
      for (const file of this.files) {
        const ext = file.name.split('.').pop()
        const fileName = `${this.$route.params.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('appointment-attachments').upload(fileName, file)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('appointment-attachments').getPublicUrl(fileName)
          uploadedUrls.push(publicUrl)
        }
      }

      let data, error
      if (this.isEditing) {
        const allUrls = [...this.editingAttachments, ...uploadedUrls]
        ;({ data, error } = await supabase
          .from('appointment_notes')
          .update({ note: this.note, attachments: allUrls })
          .eq('id', this.editingNoteId)
          .select()
          .single())
        if (!error) {
          const idx = this.notes.findIndex(n => n.id === this.editingNoteId)
          if (idx !== -1) {
            this.notes[idx] = {
              ...data,
              attachments: data.attachments || []
            }
          }
        }
      } else {
        ;({ data, error } = await supabase
          .from('appointment_notes')
          .insert({
            appointment_id: this.$route.params.id,
            user_id: this.userId,
            note: this.note,
            attachments: uploadedUrls
          })
          .select()
          .single())
        if (!error) {
          this.notes.unshift({
            ...data,
            attachments: data.attachments || []
          })
        }
      }

      if (!error) {
        this.note = ''
        this.files = []
        this.isEditing = false
        this.editingNoteId = null
        this.editingAttachments = []
        if (!wasEditing) {
          const { data: appt, error: statusError } = await supabase
            .from('appointments')
            .update({ status: 'completed' })
            .eq('id', this.$route.params.id)
            .select()
            .single()
          if (!statusError && this.appointment) {
            this.appointment.status = appt.status
          }
        }
      } else {
        alert('Erro ao salvar atendimento: ' + error.message)
      }
    }
  },
  watch: {
    '$route.params.id'() {
      this.fetchData()
    },
    '$route.query.note'(val) {
      if (!val) {
        if (this.isEditing) this.cancelEdit()
        return
      }
      const note = this.notes.find(n => n.id === Number(val) || n.id === val)
      if (note) {
        this.editExistingNote(note)
      }
    }
  },
  async mounted() {
    await this.fetchData()
  }
}
</script>
