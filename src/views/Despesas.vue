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
      <HeaderUser title="Despesas" />

      <section class="bg-white p-4 rounded-lg shadow">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h3 class="text-lg font-medium">Despesas cadastradas</h3>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button @click="openModal()" class="btn w-full sm:w-auto">Nova Despesa</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">Título</th>
                <th class="px-4 py-2 font-medium text-gray-700">Valor</th>
                <th class="px-4 py-2 font-medium text-gray-700">Vencimento</th>
                <th class="px-4 py-2 font-medium text-gray-700">Pagamento</th>
                <th class="px-4 py-2 font-medium text-gray-700">Tipo</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in filteredExpenses" :key="e.id" class="border-b last:border-b-0">
                <td class="px-4 py-2">{{ e.title }}</td>
                <td class="px-4 py-2">{{ formatPrice(e.amount) }}</td>
                <td class="px-4 py-2">{{ formatDateBR(e.due_date) }}</td>
                <td class="px-4 py-2">{{ e.paid_date ? formatDateBR(e.paid_date) : '-' }}</td>
                <td class="px-4 py-2">{{ e.fixed ? 'Fixa' : 'Variável' }}</td>
                <td class="px-4 py-2 text-right space-x-2">
                  <button @click="openModal(e)" class="btn btn-sm">Editar</button>
                  <button @click="handleDeleteExpense(e.id)" class="btn btn-sm btn-danger">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="filteredExpenses.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhuma despesa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Modal v-if="showModal" @close="closeModal">
        <h3 class="text-lg font-semibold mb-4">{{ editingId ? 'Editar Despesa' : 'Nova Despesa' }}</h3>
        <form @submit.prevent="handleSaveExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Título da despesa</label>
            <input type="text" v-model="form.title" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Valor da despesa</label>
            <input
              type="text"
              v-model="form.amount"
              @input="form.amount = currencyMask(form.amount)"
              class="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Data de Vencimento</label>
            <input type="date" v-model="form.dueDate" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Data de Pagamento</label>
            <input type="date" v-model="form.paidDate" class="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fixa ou Variável?</label>
            <select v-model="form.fixed" class="w-full px-4 py-2 border rounded-md">
              <option :value="false">Variável</option>
              <option :value="true">Fixa</option>
            </select>
          </div>
          <div v-if="form.fixed">
            <label class="block text-sm font-medium text-gray-700 mb-1">Replicar por</label>
            <select v-model="form.repeat" class="w-full px-4 py-2 border rounded-md">
              <option v-for="n in 12" :key="n" :value="n">{{ n }} mês{{ n > 1 ? 'es' : '' }}</option>
            </select>
          </div>
          <div class="text-right">
            <button type="submit" class="btn">Salvar</button>
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
import { formatDateBR, currencyMask, currencyToNumber } from '../utils/format'
import { addMonths } from '../utils/datetime'

export default {
  name: 'Despesas',
  components: { Sidebar, HeaderUser, Modal },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768,
      userId: null,
      search: '',
      expenses: [],
      showModal: false,
      editingId: null,
      form: {
        title: '',
        amount: '',
        dueDate: '',
        paidDate: '',
        fixed: false,
        repeat: 1
      }
    }
  },
  computed: {
    filteredExpenses() {
      const term = this.search.toLowerCase()
      return this.expenses.filter(
        e =>
          e.title.toLowerCase().includes(term) ||
          (e.amount !== null && e.amount.toString().includes(term))
      )
    }
  },
  methods: {
    openModal(expense) {
      if (expense) {
        this.editingId = expense.id
        this.form = {
          title: expense.title,
          amount: this.formatPrice(expense.amount),
          dueDate: expense.due_date,
          paidDate: expense.paid_date || '',
          fixed: expense.fixed,
          repeat: expense.repeat_months || 1
        }
      } else {
        this.editingId = null
        this.form = {
          title: '',
          amount: '',
          dueDate: '',
          paidDate: '',
          fixed: false,
          repeat: 1
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
      this.form = {
        title: '',
        amount: '',
        dueDate: '',
        paidDate: '',
        fixed: false,
        repeat: 1
      }
    },
    formatPrice(value) {
      if (value === null || value === undefined || value === '') return ''
      return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    },
    formatDateBR,
    currencyMask,
    async handleSaveExpense() {
      const amount = currencyToNumber(this.form.amount)
      if (this.editingId) {
        const { data, error } = await supabase
          .from('expenses')
          .update({
            title: this.form.title,
            amount,
            due_date: this.form.dueDate,
            paid_date: this.form.paidDate || null,
            fixed: this.form.fixed,
            repeat_months: this.form.fixed ? this.form.repeat : null
          })
          .eq('id', this.editingId)
          .select()
          .single()
        if (error) {
          alert('Erro ao salvar despesa: ' + error.message)
          return
        }
        const index = this.expenses.findIndex(e => e.id === this.editingId)
        if (index !== -1) this.expenses[index] = data
      } else {
        const base = {
          title: this.form.title,
          amount,
          due_date: this.form.dueDate,
          paid_date: this.form.paidDate || null,
          fixed: this.form.fixed,
          repeat_months: this.form.fixed ? this.form.repeat : null,
          user_id: this.userId
        }
        const inserts = [base]
        if (this.form.fixed && this.form.repeat >= 1) {
          for (let i = 1; i <= this.form.repeat; i++) {
            inserts.push({
              ...base,
              due_date: addMonths(this.form.dueDate, i),
              paid_date: this.form.paidDate ? addMonths(this.form.paidDate, i) : null,
              repeat_months: null
            })
          }
        }
        const { data, error } = await supabase
          .from('expenses')
          .insert(inserts)
          .select()
        if (error) {
          alert('Erro ao salvar despesa: ' + error.message)
          return
        }
        this.expenses.push(...data)
      }
      this.closeModal()
    },
    async handleDeleteExpense(id) {
      const confirmed = confirm('Tem certeza que deseja excluir esta despesa?')
      if (!confirmed) return

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Erro ao excluir despesa: ' + error.message)
      } else {
        this.expenses = this.expenses.filter(e => e.id !== id)
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

    const { data } = await supabase
      .from('expenses')
      .select()
      .eq('user_id', this.userId)

    if (data) this.expenses = data
  }
}
</script>
