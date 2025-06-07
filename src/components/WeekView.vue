<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
      <button @click="prevWeek" class="p-1 rounded hover:bg-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="font-semibold">{{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }}</div>
      <button @click="nextWeek" class="p-1 rounded hover:bg-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <div class="relative overflow-x-auto">
      <div
        v-if="showCurrentLine"
        class="absolute left-0 right-0 border-t-2 border-blue-500 pointer-events-none"
        :style="{ top: currentLineTop + 'px' }"
      ></div>
      <div
        ref="grid"
        class="grid gap-px text-sm bg-gray-100"
        :style="{ gridTemplateColumns: '64px repeat(7, 1fr)' }"
      >
        <div class="bg-gray-50"></div>
        <div
          v-for="(day, idx) in daysOfWeek"
          :key="day"
          class="font-semibold text-center border px-1 bg-gray-50"
          :class="{ 'bg-blue-50': isToday(idx) }"
        >
          {{ day }}
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
      timeSlots: [],
      currentLineTop: 0,
      lineInterval: null
    }
  },
  computed: {
    weekEnd() {
      const d = new Date(this.weekStart)
      d.setDate(d.getDate() + 6)
      return d
    },
    showCurrentLine() {
      const totalHeight = this.timeSlots.length * 64
      return this.currentLineTop >= 0 && this.currentLineTop <= totalHeight
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
    updateCurrentLine() {
      if (this.timeSlots.length === 0) return
      const firstHour = parseInt(this.timeSlots[0].split(':')[0])
      const now = new Date()
      const hours = now.getHours() + now.getMinutes() / 60
      const pos = (hours - firstHour) * 64
      this.currentLineTop = pos
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
    },
    isToday(offset) {
      const today = new Date()
      const d = this.getDateOfDay(offset)
      return d.toDateString() === today.toDateString()
    }
  },
  watch: {
    startTime() {
      this.generateTimeSlots()
      this.$nextTick(this.updateCurrentLine)
    },
    endTime() {
      this.generateTimeSlots()
      this.$nextTick(this.updateCurrentLine)
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
    this.updateCurrentLine()
    this.lineInterval = setInterval(this.updateCurrentLine, 60000)
  },
  beforeUnmount() {
    if (this.lineInterval) clearInterval(this.lineInterval)
  }
}
</script>

