<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
      <button @click="prevMonth" class="p-1 rounded hover:bg-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="font-semibold">{{ monthNames[currentMonth] }} {{ currentYear }}</div>
      <button @click="nextMonth" class="p-1 rounded hover:bg-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <div class="grid grid-cols-7 gap-px text-sm bg-gray-100">
      <div
        class="font-semibold text-center bg-gray-50 p-1"
        v-for="day in daysOfWeek"
        :key="day"
      >
        {{ day }}
      </div>
      <div v-for="n in leadingBlanks" :key="'b'+n" class="bg-white h-24"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="border border-gray-200 h-24 p-1 overflow-auto bg-white"
        :class="{ 'bg-blue-50 border-l-4 border-blue-500': isToday(day) }"
      >
        <div class="text-center font-medium">{{ day }}</div>
        <ul>
          <li v-for="appt in getAppointmentsForDay(day)" :key="appt.id" class="text-xs truncate">
            {{ appt.time }} - {{ getClientName(appt.client_id) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarView',
  props: {
    appointments: {
      type: Array,
      required: true
    },
    getClientName: {
      type: Function,
      required: true
    }
  },
  data() {
    const today = new Date()
    return {
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth(),
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    }
  },
  computed: {
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
    },
    leadingBlanks() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay()
    }
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    goToCurrentMonth() {
      const today = new Date()
      this.currentYear = today.getFullYear()
      this.currentMonth = today.getMonth()
    },
    getAppointmentsForDay(day) {
      const month = String(this.currentMonth + 1).padStart(2, '0')
      const d = String(day).padStart(2, '0')
      const dateStr = `${this.currentYear}-${month}-${d}`
      return this.appointments.filter(a => a.date === dateStr)
    },
    isToday(day) {
      const today = new Date()
      return (
        this.currentYear === today.getFullYear() &&
        this.currentMonth === today.getMonth() &&
        day === today.getDate()
      )
    }
  }
}
</script>
