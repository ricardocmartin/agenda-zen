<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <button @click="prevWeek" class="px-2">&lt;</button>
      <div class="font-semibold">{{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }}</div>
      <button @click="nextWeek" class="px-2">&gt;</button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-sm">
      <div class="font-semibold text-center" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      <div v-for="i in 7" :key="i" class="border h-48 p-1 overflow-auto">
        <div class="text-center font-medium">{{ getDateOfDay(i - 1).getDate() }}</div>
        <ul>
          <li
            v-for="appt in getAppointmentsForDay(i - 1)"
            :key="appt.id"
            class="text-xs truncate cursor-pointer"
            @click="$emit('select', appt)"
          >
            {{ appt.time }} - {{ getClientName(appt.client_id) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeekView',
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
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    return {
      weekStart,
      daysOfWeek: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    }
  },
  computed: {
    weekEnd() {
      const d = new Date(this.weekStart)
      d.setDate(d.getDate() + 6)
      return d
    }
  },
  methods: {
    formatDate(date) {
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${d}/${m}`
    },
    formatISO(date) {
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${date.getFullYear()}-${m}-${d}`
    },
    getDateOfDay(offset) {
      const d = new Date(this.weekStart)
      d.setDate(d.getDate() + offset)
      return d
    },
    getAppointmentsForDay(offset) {
      const day = this.formatISO(this.getDateOfDay(offset))
      return this.appointments
        .filter(a => a.date === day)
        .sort((a, b) => a.time.localeCompare(b.time))
    },
    prevWeek() {
      const d = new Date(this.weekStart)
      d.setDate(d.getDate() - 7)
      this.weekStart = d
    },
    nextWeek() {
      const d = new Date(this.weekStart)
      d.setDate(d.getDate() + 7)
      this.weekStart = d
    }
  }
}
</script>

