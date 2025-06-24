
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
          gridTemplateRows: `repeat(${endHour - startHour}, 60px)`
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
        <template v-for="hour in (endHour - startHour)" :key="'line-' + hour">
          <div class="flex justify-center items-start border bg-gray-50">
            {{ (startHour + hour - 1).toString().padStart(2, '0') }}:00
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
          class="absolute bg-blue-500 text-white rounded px-2 py-1 event"
          :style="getEventStyle(event)"
        >
          {{ event.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startHour: 9,
      endHour: 18,
      weekStart: '23/06',
      weekEnd: '29/06',
      dayLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      events: [
        { id: 1, title: 'Jeferson Carlos A de Paula', startTime: '10:00', endTime: '11:00', day: 2 },
        { id: 2, title: 'Ricardo Martin', startTime: '14:00', endTime: '15:00', day: 2 },
        { id: 3, title: 'Patricia Souza Vinha', startTime: '16:00', endTime: '17:00', day: 6 },
      ]
    };
  },
  methods: {
    getEventStyle(event) {
      const startHour = parseInt(event.startTime.split(':')[0]);
      const startMinute = parseInt(event.startTime.split(':')[1]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      const endMinute = parseInt(event.endTime.split(':')[1]);

      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      const gridStart = this.startHour * 60;

      const minuteHeight = 1;

      const top = (startInMinutes - gridStart) * minuteHeight;
      const height = (endInMinutes - startInMinutes) * minuteHeight;

      const colWidth = 100 / 7;

      return {
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${(event.day - 1) * colWidth}% + 64px)`,
        width: `calc(${colWidth}% - 4px)`
      };
    },
    formatDate(date) {
      return date;
    }
  }
};
</script>

<style scoped>
.grid {
  position: relative;
}
.grid > div {
  position: relative;
}
.event {
  position: absolute;
  z-index: 10;
}
</style>
