<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <button @click="prevMonth" class="px-2">&lt;</button>
      <div class="font-semibold">{{ monthNames[currentMonth] }} {{ currentYear }}</div>
      <button @click="nextMonth" class="px-2">&gt;</button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-sm">
      <div class="font-semibold text-center" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      <div v-for="n in leadingBlanks" :key="'b'+n"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="border h-24 p-1 overflow-auto"
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
      monthNames: ['Janeiro', 'Fevereiro', 'Mar\u00e7o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S\u00e1b']
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
    getAppointmentsForDay(day) {
      const month = String(this.currentMonth + 1).padStart(2, '0')
      const d = String(day).padStart(2, '0')
      const dateStr = `${this.currentYear}-${month}-${d}`
      return this.appointments.filter(a => a.date === dateStr)
    }
  }
}
</script>
