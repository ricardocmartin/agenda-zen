<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <button @click="prevWeek" class="px-2">&lt;</button>
      <div class="font-semibold">{{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }}</div>
      <button @click="nextWeek" class="px-2">&gt;</button>
    </div>
    <div class="overflow-x-auto">
      <div
        class="grid gap-px text-sm"
        :style="{ gridTemplateColumns: '64px repeat(7, 1fr)' }"
      >
        <div></div>
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="font-semibold text-center border px-1"
        >
          {{ day }}
        </div>

        <template v-for="time in timeSlots" :key="time">
          <div class="font-semibold text-right pr-1 border">{{ time }}</div>
          <div
            v-for="i in 7"
            :key="time + '-' + i"
            class="border h-16 p-1 overflow-auto"
          >
            <ul>
              <li
                v-for="appt in getAppointmentsForSlot(i - 1, time)"
                :key="appt.id"
                class="text-xs truncate cursor-pointer"
                @click="$emit('select', appt)"
              >
                {{ appt.time }} - {{ getClientName(appt.client_id) }}
              </li>
            </ul>
          </div>
        </template>
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
      daysOfWeek: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      timeSlots: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
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
    getAppointmentsForSlot(offset, slot) {
      const day = this.formatISO(this.getDateOfDay(offset))
      const slotHour = parseInt(slot.split(':')[0])
      return this.appointments
        .filter(
          a => a.date === day && parseInt(a.time.substring(0, 2)) === slotHour
        )
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

