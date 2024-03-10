declare module 'vue3-datepicker-ja' {
  import { Plugin } from 'vue'

  export interface DatePickerOptions {
    modelValue: string
    disabled?: boolean
    placeholder?: string
    displayFormat?: string
    isDateDisabled?: (date: Date) => boolean
  }

  export const DatePicker: Plugin
}
