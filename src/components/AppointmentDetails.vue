<template>
  <div class="relative">
    <button
      @click="$emit('close')"
      class="absolute top-0 right-0 m-2 px-2 py-1 rounded border text-sm"
    >
      Fechar
    </button>
    <h3 class="text-lg font-semibold mb-4">Detalhes do Agendamento</h3>
    <div v-if="appointment" class="space-y-1 border rounded-md p-4 bg-gray-50 text-gray-700">
      <p><strong>Data:</strong> {{ formatDateBR(appointment.date) }}</p>
      <p><strong>Hora:</strong> {{ addHoursToTime(appointment.time) }}</p>
      <p><strong>Cliente:</strong> {{ getClientName(appointment.client_id) }}</p>
      <p><strong>Serviço:</strong> {{ getServiceName(appointment.service_id) }}</p>
      <p><strong>Duração:</strong> {{ appointment.duration }} minutos</p>
      <p><strong>Descrição:</strong> {{ appointment.description }}</p>
      <p v-if="appointment.room_id"><strong>Sala:</strong> {{ getRoomName(appointment.room_id) }}</p>
      <p v-if="appointment.room_id && getRoomLink(appointment.room_id)">
        <a :href="getRoomLink(appointment.room_id)" target="_blank" class="text-blue-600 underline">Acessar Google Meet</a>
      </p>
    </div>
    <slot name="actions"></slot>
  </div>
</template>

<script>
import { addHoursToTime } from '../utils/datetime'
import { formatDateBR } from '../utils/format'
export default {
  name: 'AppointmentDetails',
  props: {
    appointment: { type: Object, required: true },
    getClientName: { type: Function, required: true },
    getServiceName: { type: Function, required: true },
    getRoomName: { type: Function, default: () => '' },
    getRoomLink: { type: Function, default: () => '' }
  },
  methods: {
    addHoursToTime,
    formatDateBR
  }
}
</script>
