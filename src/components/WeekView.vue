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
        <div class="bg-gray-100"></div>
        <div
          v-for="(day, idx) in daysOfWeek"
          :key="day"
          class="font-semibold text-center border px-1 py-1 bg-gray-100"
          :class="{ 'bg-blue-50': isToday(idx) }"
        >
          {{ day }} {{ formatDate(getDateOfDay(idx)) }}
        </div>

        <template v-for="time in timeSlots" :key="time">
          <div class="font-semibold text-right pr-1 border bg-gray-50">{{ time }}</div>
          <div
            v-for="i in 7"
            :key="time + '-' + i"
            class="border h-16 p-1 overflow-auto bg-white"
          >
            <ul>
              <li
                v-for="appt in getAppointmentsForSlot(i - 1, time)"
                :key="appt.id"
                class="text-xs truncate cursor-pointer bg-blue-100 rounded px-1 mb-1"
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
import { supabase } from '../supabase'

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
      startTime: '00:00',
      endTime: '23:00',
      timeSlots: []
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
    generateTimeSlots() {
      const start = Math.max(0, parseInt(this.startTime.split(':')[0]) - 1)
      const end = Math.min(23, parseInt(this.endTime.split(':')[0]) + 1)
      this.timeSlots = []
      for (let h = start; h <= end; h++) {
        this.timeSlots.push(`${String(h).padStart(2, '0')}:00`)
      }
    },
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
    isToday(offset) {
      const today = new Date()
      const d = new Date(this.weekStart)
      d.setDate(d.getDate() + offset)
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      )
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
  },
  watch: {
    startTime() {
      this.generateTimeSlots()
    },
    endTime() {
      this.generateTimeSlots()
    }
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('start_time, end_time')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.start_time) this.startTime = data.start_time
        if (data.end_time) this.endTime = data.end_time
      }
    }
    this.generateTimeSlots()
  }
}
</script>

