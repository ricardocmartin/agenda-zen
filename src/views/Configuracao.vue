<template>
    <div class="min-h-screen flex bg-gray-100">
      <Sidebar />
  
      <main class="flex-1 p-8">
        <HeaderUser title="Configurações do Perfil" />
  
        <form @submit.prevent="handleSave" class="space-y-6 max-w-3xl">
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
        slug: '',
        form: {
          businessName: '',
          description: '',
          phone: '',
          whatsapp: '',
          email: '',
          address: '',
          instagram: '',
          facebook: '',
          youtube: '',
          x: ''
        }
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
          phone: this.form.phone,
          whatsapp: this.form.whatsapp,
          email: this.form.email,
          address: this.form.address,
          instagram: this.form.instagram,
          facebook: this.form.facebook,
          youtube: this.form.youtube,
          x: this.form.x
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
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          address: data.address || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          youtube: data.youtube || '',
          x: data.x || ''
        }
        this.updateSlug()
      }
    }
  }
  </script>