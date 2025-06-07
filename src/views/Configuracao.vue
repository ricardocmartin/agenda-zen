<template>
    <div class="min-h-screen flex bg-gray-100 relative">
      <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

      <main class="flex-1 p-8">
        <div v-if="!sidebarOpen" class="flex items-center mb-4">
          <button @click="sidebarOpen = true" class="text-gray-600 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <HeaderUser title="Configurações" />
        <router-link to="/onboarding" class="text-blue-600 underline mb-4 inline-block">Refazer Onboarding</router-link>

        <nav class="mb-6 space-x-2">
          <button
            @click="activeTab = 'perfil'"
            :class="activeTab === 'perfil' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
            class="px-4 py-2 rounded-l"
          >Perfil</button>
          <button
            @click="activeTab = 'agenda'"
            :class="activeTab === 'agenda' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
            class="px-4 py-2 rounded-r"
          >Agenda</button>
        </nav>

        <form v-if="activeTab === 'perfil'" @submit.prevent="handleSave" class="space-y-6 max-w-3xl">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome Comercial</label>
            <input type="text" v-model="form.businessName" @input="updateSlug" class="w-full mt-1 px-4 py-2 border rounded-md">
            <p class="text-sm text-gray-500 mt-1">
              Seu link público:
              <span class="font-mono">/agenda-zen/#/{{ slug }}</span>
              <a
                :href="'/agenda-zen/#/' + slug"
                target="_blank"
                class="text-blue-600 hover:underline ml-2"
              >Abrir página do cliente</a>
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição do Estabelecimento</label>
            <textarea v-model="form.description" class="w-full mt-1 px-4 py-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Área de Atuação</label>
            <select v-model="form.areaAtuacao" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option disabled value="">Selecione</option>
              <option>Psicologia</option>
              <option>Terapias Gerais</option>
              <option>Psicopedagogia</option>
              <option>Medicina</option>
              <option>Coaching</option>
              <option>Fonoaudiologia</option>
              <option>Fisioterapia</option>
              <option>Nutrição</option>
              <option>Terapia Ocupacional</option>
            </select>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Telefone de Contato</label>
              <input type="text" v-model="form.phone" class="w-full mt-1 px-4 py-2 border rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input type="text" v-model="form.whatsapp" class="w-full mt-1 px-4 py-2 border rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" v-model="form.email" class="w-full mt-1 px-4 py-2 border rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Endereço</label>
              <input type="text" v-model="form.address" class="w-full mt-1 px-4 py-2 border rounded-md">
            </div>
          </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Instagram</label>
            <input type="text" v-model="form.instagram" class="w-full mt-1 px-4 py-2 border rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Facebook</label>
            <input type="text" v-model="form.facebook" class="w-full mt-1 px-4 py-2 border rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">YouTube</label>
            <input type="text" v-model="form.youtube" class="w-full mt-1 px-4 py-2 border rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">X (Twitter)</label>
            <input type="text" v-model="form.x" class="w-full mt-1 px-4 py-2 border rounded-md">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Imagem do Estabelecimento</label>
          <input type="file" accept="image/*" @change="handleImageUpload" class="mt-1" />
          <div v-if="form.imageUrl" class="mt-2">
            <img :src="form.imageUrl" alt="Imagem do estabelecimento" class="h-24 rounded-md" />
          </div>
        </div>
        <div>
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
        </div>
      </form>

      <form v-if="activeTab === 'agenda'" @submit.prevent="handleSaveAgenda" class="space-y-6 max-w-3xl">
        <div>
          <label class="block text-sm font-medium text-gray-700">Início dos atendimentos</label>
          <input type="time" v-model="agenda.startTime" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Final dos atendimentos</label>
          <input type="time" v-model="agenda.endTime" class="w-full mt-1 px-4 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Dias da semana dos atendimentos</label>
          <div class="mt-1 space-y-1">
            <label v-for="day in daysOfWeekOptions" :key="day.value" class="flex items-center space-x-2">
              <input type="checkbox" :value="day.value" v-model="agenda.daysOfWeek" />
              <span>{{ day.label }}</span>
            </label>
          </div>
        </div>
        <div>
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar</button>
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
    name: 'Configuracao',
    components: { Sidebar, HeaderUser },
    data() {
      return {
        userId: null,
        sidebarOpen: true,
        slug: '',
        activeTab: 'perfil',
        form: {
          businessName: '',
          description: '',
          areaAtuacao: '',
          phone: '',
          whatsapp: '',
          email: '',
          address: '',
          instagram: '',
          facebook: '',
          youtube: '',
          x: '',
          imageUrl: ''
        },
        agenda: {
          startTime: '',
          endTime: '',
          daysOfWeek: []
        },
        daysOfWeekOptions: [
          { value: '0', label: 'Domingo' },
          { value: '1', label: 'Segunda' },
          { value: '2', label: 'Terça' },
          { value: '3', label: 'Quarta' },
          { value: '4', label: 'Quinta' },
          { value: '5', label: 'Sexta' },
          { value: '6', label: 'Sábado' }
        ]
      }
    },
    methods: {
      updateSlug() {
        this.slug = this.form.businessName
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      },
      async handleSave() {
        const updates = {
          id: this.userId,
          business_name: this.form.businessName,
          slug: this.slug,
          description: this.form.description,
          area_atuacao: this.form.areaAtuacao,
          phone: this.form.phone,
          whatsapp: this.form.whatsapp,
          email: this.form.email,
          address: this.form.address,
          instagram: this.form.instagram,
          facebook: this.form.facebook,
          youtube: this.form.youtube,
          x: this.form.x,
          image_url: this.form.imageUrl
        }
        const { error } = await supabase
          .from('profiles')
          .upsert(updates, { onConflict: ['id'] })
  
        if (error) {
          alert('Erro ao salvar dados: ' + error.message)
        } else {
          alert('Dados salvos com sucesso!')
        }
      },
      async handleImageUpload(event) {
        const file = event.target.files[0]
        if (!file) return
        const fileExt = file.name.split('.').pop()
        const fileName = `${this.userId}.${fileExt}`
        const { error } = await supabase
          .storage
          .from('profile-images')
          .upload(fileName, file, { upsert: true })
        if (error) {
          alert('Erro ao enviar imagem: ' + error.message)
          return
        }
        const {
          data: { publicUrl }
        } = supabase.storage.from('profile-images').getPublicUrl(fileName)
        this.form.imageUrl = publicUrl
      },
      async handleSaveAgenda() {
        const updates = {
          id: this.userId,
          start_time: this.agenda.startTime,
          end_time: this.agenda.endTime,
          week_days: this.agenda.daysOfWeek.join(',')
        }
        const { error } = await supabase
          .from('profiles')
          .upsert(updates, { onConflict: ['id'] })

        if (error) {
          alert('Erro ao salvar dados: ' + error.message)
        } else {
          alert('Dados salvos com sucesso!')
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
  
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', this.userId)
        .single()
  
      if (data) {
        this.form = {
          businessName: data.business_name || '',
          description: data.description || '',
          areaAtuacao: data.area_atuacao || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          address: data.address || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          youtube: data.youtube || '',
          x: data.x || '',
          imageUrl: data.image_url || ''
        }
        this.agenda = {
          startTime: data.start_time || '',
          endTime: data.end_time || '',
          daysOfWeek: data.week_days ? data.week_days.split(',') : []
        }
        this.updateSlug()
      }
    }
  }
  </script>