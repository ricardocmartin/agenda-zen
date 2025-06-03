<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal'
}
</script>
