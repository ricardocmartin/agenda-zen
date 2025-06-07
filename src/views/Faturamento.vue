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
      <HeaderUser title="Relatório de Faturamento" />

      <section class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700">Serviços</label>
            <div class="mt-1 space-y-1">
              <label v-for="s in services" :key="s.id" class="flex items-center space-x-2">
                <input type="checkbox" :value="s.id" v-model="selectedServices" />
                <span>{{ s.name }}</span>
              </label>
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Datas</label>
            <div class="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label class="block text-xs font-medium text-gray-700">De</label>
                <input type="date" v-model="filterStart" class="w-full mt-1 px-4 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700">Até</label>
                <input type="date" v-model="filterEnd" class="w-full mt-1 px-4 py-2 border rounded-md" />
              </div>
            </div>
          </div>
          <div class="md:col-span-2 md:col-start-2">
            <label class="block text-sm font-medium text-gray-700">Agrupar por</label>
            <select v-model="groupBy" class="w-full mt-1 px-4 py-2 border rounded-md">
              <option value="mes">Mês</option>
              <option value="semana">Semana</option>
              <option value="dia">Dia</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="fetchRevenue" class="btn">Aplicar</button>
        </div>
      </section>

      <section class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Período</th>
                <th class="px-4 py-2 font-medium text-gray-700">Faturamento</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in revenueData" :key="r.label" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ r.label }}</td>
                <td class="px-4 py-2">{{ formatPrice(r.total) }}</td>
              </tr>
              <tr v-if="revenueData.length === 0">
                <td colspan="2" class="px-4 py-6 text-center text-gray-500">Nenhum dado</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="h-64">
          <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import HeaderUser from '../components/HeaderUser.vue'
import { supabase } from '../supabase'
import { Chart } from 'chart.js/auto'

export default {
  name: 'Faturamento',
  components: { Sidebar, HeaderUser },
  data() {
    return {
      userId: null,
      sidebarOpen: true,
      services: [],
      selectedServices: [],
      filterStart: '',
      filterEnd: '',
      groupBy: 'mes',
      revenueData: [],
      chart: null
    }
  },
  methods: {
    async fetchServices() {
      const { data } = await supabase
        .from('services')
        .select()
        .eq('user_id', this.userId)
      this.services = data || []
      this.selectedServices = this.services.map(s => s.id)
    },
    async fetchRevenue() {
      if (!this.filterStart || !this.filterEnd) return
      const { data } = await supabase
        .from('appointments')
        .select('date, service_id')
        .eq('user_id', this.userId)
        .gte('date', this.filterStart)
        .lte('date', this.filterEnd)
      const appointments = data || []
      const priceMap = {}
      this.services.forEach(s => {
        priceMap[s.id] = Number(s.price) || 0
      })
      const filtered = this.selectedServices.length
        ? appointments.filter(a => this.selectedServices.includes(a.service_id))
        : appointments
      const groups = {}
      filtered.forEach(a => {
        const date = new Date(a.date)
        let label = ''
        if (this.groupBy === 'dia') {
          label = date.toISOString().split('T')[0]
        } else if (this.groupBy === 'semana') {
          const week = this.getWeekNumber(date)
          label = `${date.getFullYear()}-W${week}`
        } else {
          label = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        }
        const price = priceMap[a.service_id] || 0
        groups[label] = (groups[label] || 0) + price
      })
      this.revenueData = Object.keys(groups)
        .sort()
        .map(k => ({ label: k, total: groups[k] }))
      this.renderChart()
    },
    getWeekNumber(d) {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      const dayNum = date.getUTCDay() || 7
      date.setUTCDate(date.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
      const weekNum = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
      return weekNum
    },
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      if (this.chart) this.chart.destroy()
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.revenueData.map(r => r.label),
          datasets: [
            {
              label: 'Faturamento',
              data: this.revenueData.map(r => r.total),
              backgroundColor: '#3b82f6'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      })
    },
    formatPrice(value) {
      return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      this.$router.push('/login')
      return
    }
    this.userId = user.id
    await this.fetchServices()
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    this.filterStart = firstDay.toISOString().split('T')[0]
    this.filterEnd = lastDay.toISOString().split('T')[0]
  }
}
</script>

