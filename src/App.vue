<script setup lang="ts">
import { ref } from 'vue'
// import DatePicker from './DatePicker'
import DatePicker from 'vue3-datepicker-ja'

const currentDate = defineModel('currentDate', {
  type: String,
  default: '2024-03-01',
})

const desplayFormat = ref('yyyy-MM-dd')
const disabled = ref(false)
const placeholder = ref('Please select a date')

// 日曜日を無効にする
const isDateDisabled = ref((date: Date) => date.getDay() === 0)
</script>

<template>
  <div>
    <DatePicker
      v-model="currentDate"
      ref="datePick"
      :display-format="desplayFormat"
      :is-date-disabled="isDateDisabled"
      :disabled="disabled"
      :placeholder="placeholder"
    />
  </div>
</template>
