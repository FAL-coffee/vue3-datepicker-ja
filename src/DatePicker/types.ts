export type Props = {
  modelValue: string
  disabled?: boolean
  placeholder?: string
  displayFormat?: string
  isDateDisabled?: (date: Date) => boolean
}

export type EnhancedDay = {
  date: Date
  outOfRange?: boolean
  disabled?: boolean
  today?: boolean
  dateKey?: string
  selected?: boolean
}
