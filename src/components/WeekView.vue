
<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
      <div class="font-semibold">{{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }}</div>
    </div>

    <div class="relative overflow-x-auto">
      <div
        ref="grid"
        class="grid gap-px text-sm bg-gray-100 relative"
        :style="{
          gridTemplateColumns: '64px repeat(7, 1fr)',
          gridTemplateRows: `repeat(${totalHours}, 60px)`
        }"
      >
        <!-- Cabeçalho dos dias -->
        <div class="bg-gray-50"></div>
        <div
          v-for="(day, index) in dayLabels"
          :key="'day-' + index"
          class="font-semibold text-center border px-1 bg-gray-50"
        >
          {{ day }}
        </div>

        <!-- Linhas de horários e células -->
        <template v-for="hour in totalHours" :key="'line-' + hour">
          <div class="flex justify-center items-start border bg-gray-50">
            {{ (computedStartHour + hour - 1).toString().padStart(2, '0') }}:00
          </div>
          <div
            v-for="day in 7"
            :key="'cell-' + day + '-' + hour"
            class="relative bg-white border"
          ></div>
        </template>

        <!-- Renderização dos eventos -->
        <div
          v-for="event in events"
          :key="event.id"
          class="absolute bg-blue-500 text-white rounded px-2 py-1 event cursor-pointer"
          :style="getEventStyle(event)"
          @click="$emit('select', event.appointment)"
        >
          {{ event.title }} - {{ event.startTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateBR } from '../utils/format'

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
    },
    startHour: {
      type: Number,
      default: 0
    },
    endHour: {
      type: Number,
      default: 23
    }
  },
  data() {
    const today = new Date()
    // calculate monday as start of week (1) with sunday as 7
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek + 1)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return {
      weekStart: start,
      weekEnd: end,
      dayLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      minuteHeight: 1
    }
  },
  computed: {
    computedStartHour() {
      return 0
    },
    computedEndHour() {
      return 23
    },
    totalHours() {
      return Math.max(0, this.computedEndHour - this.computedStartHour + 1)
    },
    events() {
      const startStr = this.weekStart.toISOString().split('T')[0]
      const endStr = this.weekEnd.toISOString().split('T')[0]

      const events = this.appointments
        .filter(a => a.date >= startStr && a.date <= endStr)
        .map(a => {
          const [hour, minute] = a.time.split(':')
          const startDate = new Date(`${a.date}T${a.time}`)
          const endDate = new Date(startDate.getTime() + Number(a.duration || 0) * 60000)
          const day = startDate.getDay() === 0 ? 7 : startDate.getDay()
          return {
            id: a.id,
            title: this.getClientName(a.client_id),
            startTime: `${hour}:${minute}`,
            endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
            day,
            appointment: a,
            lane: 0,
            totalLanes: 1
          }
        })

      const byDay = {}
      const toMinutes = t => {
        const [h, m] = t.split(':').map(Number)
        return h * 60 + m
      }

      events.forEach(e => {
        if (!byDay[e.day]) byDay[e.day] = []
        byDay[e.day].push(e)
      })

      Object.values(byDay).forEach(dayEvents => {
        dayEvents.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
        let active = []
        dayEvents.forEach(event => {
          active = active.filter(e => toMinutes(e.endTime) > toMinutes(event.startTime))
          let lane = 0
          while (active.some(e => e.lane === lane)) lane++
          event.lane = lane
          active.push(event)
          const lanes = Math.max(...active.map(e => e.lane)) + 1
          active.forEach(e => { e.totalLanes = Math.max(e.totalLanes, lanes) })
        })
      })

      return events
    }
  },
  methods: {
    updateMinuteHeight() {
      if (this.$refs.grid) {
        const style = window.getComputedStyle(this.$refs.grid)
        const row = style.gridTemplateRows.split(' ')[0]
        const height = parseFloat(row)
        if (!isNaN(height) && height > 0) {
          this.minuteHeight = height / 60
        }
      }
    },
    getEventStyle(event) {
      const startHour = parseInt(event.startTime.split(':')[0]);
      const startMinute = parseInt(event.startTime.split(':')[1]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      const endMinute = parseInt(event.endTime.split(':')[1]);

      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      const gridStart = this.computedStartHour * 60;

      const minuteHeight = this.minuteHeight;

      const top = (startInMinutes - gridStart) * minuteHeight;
      const height = (endInMinutes - startInMinutes) * minuteHeight;

      const colWidth = '(100% - 64px) / 7'
      const laneWidth = `calc((${colWidth}) / ${event.totalLanes})`

      return {
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(64px + (${colWidth}) * ${event.day - 1} + ${laneWidth} * ${event.lane})`,
        width: `calc(${laneWidth} - 4px)`
      };
    },
    formatDate(date) {
      if (date instanceof Date) {
        return formatDateBR(date.toISOString().split('T')[0])
      }
      return date
    }
  },
  watch: {
    computedStartHour() {
      this.$nextTick(this.updateMinuteHeight)
    },
    computedEndHour() {
      this.$nextTick(this.updateMinuteHeight)
    }
  },
  mounted() {
    this.updateMinuteHeight()
  }
};
</script>

<style scoped>
.grid {
  position: relative;
}
.grid > div:not(.event) {
  position: relative;
  border-bottom: 1px solid #e5e7eb;
}
.event {
  position: absolute;
  z-index: 10;
  background-color: #1a73e8;
  color: #fff;
  border-radius: 4px;
  padding: 2px 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 0.75rem;
}
</style>
