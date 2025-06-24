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
          class="grid gap-px text-sm bg-gray-100 relative"
          :style="{ gridTemplateColumns: '64px repeat(7, 1fr)' }"
        >
        <div class="bg-gray-50"></div>
        <div
          v-for="(day, idx) in daysOfWeek"
          :key="day"
          class="font-semibold text-center border px-1 bg-gray-50"
          :class="{ 'bg-blue-50 border-l-4 border-blue-500': isToday(idx) }"
        >
          {{ day }}
        </div>

        <template v-for="time in timeSlots" :key="time">
          <div class="font-semibold text-right pr-1 border bg-gray-50 h-16 flex items-center justify-end">{{ time }}</div>
          <div
            v-for="i in 7"
            :key="time + '-' + i"
            class="border h-16 p-1 bg-white day-slot"
            :class="{ 'bg-blue-50': isToday(i - 1) }"
          ></div>
        </template>
      </div>
        <div
          class="absolute inset-0 pointer-events-none grid"
          :style="{ gridTemplateColumns: '64px repeat(7, 1fr)', gridAutoRows: 'calc(4rem + 1px)', gap: '0px' }"
        >
          <div
            v-for="appt in appointments"
            :key="'box-' + appt.id"
            class="bg-blue-600 text-white text-xs rounded px-1 overflow-hidden cursor-pointer pointer-events-auto"
            :style="getBoxStyle(appt)"
            @click.stop="$emit('select', appt)"
          >
            {{ getClientName(appt.client_id) }}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { supabase } from '../supabase'

function getBrazilNow() {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  )
}

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
    const today = getBrazilNow()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    return {
      weekStart,
      daysOfWeek: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      startTime: '00:00',
      endTime: '23:00',
      dailySchedule: null,
      slotInterval: 60,
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
      const totalHeight = this.timeSlots.length * 65
      const now = getBrazilNow()
      const nowMinutes = now.getHours() * 60 + now.getMinutes()
      const [startHour, startMin] = this.startTime.split(':').map(Number)
      const [endHour, endMin] = this.endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      const withinHours = nowMinutes >= startMinutes && nowMinutes <= endMinutes
      const withinGrid =
        this.currentLineTop >= 0 && this.currentLineTop <= totalHeight
      return withinHours && withinGrid
    }
  },
  methods: {
    generateTimeSlots() {
      const [startH, startM] = this.startTime.split(':').map(Number)
      const [endH, endM] = this.endTime.split(':').map(Number)
      const start = startH * 60 + startM
      const end = endH * 60 + endM
      this.timeSlots = []
      for (let m = start; m <= end; m += this.slotInterval) {
        const h = Math.floor(m / 60)
        const mm = m % 60
        this.timeSlots.push(`${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`)
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
      const [slotH, slotM] = slot.split(':').map(Number)
      const slotStart = slotH * 60 + slotM
      const slotEnd = slotStart + this.slotInterval
      return this.appointments
        .filter(a => {
          if (a.date !== day) return false
          const [h, m] = a.time.split(':').map(Number)
          const mins = h * 60 + m
          return mins >= slotStart && mins < slotEnd
        })
        .sort((a, b) => a.time.localeCompare(b.time))
    },
    updateCurrentLine() {
      if (this.timeSlots.length === 0) return
      const [firstH, firstM] = this.timeSlots[0].split(':').map(Number)
      const now = getBrazilNow()
      const nowMinutes = now.getHours() * 60 + now.getMinutes()
      const firstMinutes = firstH * 60 + firstM
      const diff = nowMinutes - firstMinutes
      const pos = (diff / this.slotInterval) * 65
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
      const today = getBrazilNow()
      const d = this.getDateOfDay(offset)
      return d.toDateString() === today.toDateString()
    },
    getDayOffset(dateStr) {
      const d = new Date(dateStr + 'T12:00:00')
      return (d.getDay() + 6) % 7
    },
    parseMinutes(str) {
      const [h, m] = str.split(':').map(Number)
      return h * 60 + m
    },
    getSlotIndex(timeStr) {
      const mins = this.parseMinutes(timeStr)
      const start = this.parseMinutes(this.startTime)
      return Math.floor((mins - start) / this.slotInterval)
    },
    getDurationSlots(duration) {
      const mins = parseInt(duration)
      if (isNaN(mins)) return 1
      return Math.max(1, Math.round(mins / this.slotInterval))
    },
    getBoxStyle(appt) {
      const day = this.getDayOffset(appt.date)
      const rowStart = this.getSlotIndex(appt.time) + 2
      const span = this.getDurationSlots(appt.duration)
      return {
        gridColumnStart: day + 2,
        gridColumnEnd: day + 3,
        gridRowStart: rowStart,
        gridRowEnd: `span ${span}`
      }
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
        .select('start_time, end_time, daily_schedule')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.daily_schedule) {
          this.dailySchedule = typeof data.daily_schedule === 'string' ? JSON.parse(data.daily_schedule) : data.daily_schedule
          const enabled = Object.values(this.dailySchedule).filter(d => d && d.enabled && d.start && d.end)
          if (enabled.length) {
            this.startTime = enabled.reduce((m, d) => !m || d.start < m ? d.start : m, null)
            this.endTime = enabled.reduce((m, d) => !m || d.end > m ? d.end : m, null)
          }
        } else {
          if (data.start_time) this.startTime = data.start_time
          if (data.end_time) this.endTime = data.end_time
        }
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

