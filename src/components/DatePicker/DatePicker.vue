<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import {
  useCloseEventListener,
  useDateUtilities,
  useToggle,
} from './composables'
import { MONTHS, WEEKDAYS } from './constants'
import { EnhancedDay, Props } from './types'
import { chunkArray, range } from './utils'

const weekdays = WEEKDAYS
const months = MONTHS

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: 'Please select a date',
  displayFormat: 'yyyy-MM-dd',
  isDateDisabled: () => false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Date utilities
const {
  formatDateToString,
  parseDateString,
  generateCalendarDates,
  isToday,
  isSameDay,
  getPeriodFromValue,
  valueToInputFormat,
} = useDateUtilities(props.displayFormat)

// Toggle state
const { opened, toggle, open, close } = useToggle(false)

// Element
const el = ref<Element | null>(null)
const outerWrap = ref<Element | null>(null)
// ------------------------------

// State
const currentPeriod = ref(getPeriodFromValue(props.modelValue))
const inputValue = ref(valueToInputFormat(props.modelValue))
// ------------------------------

// Event listeners
const { addCloseEvents, removeCloseEvents } = useCloseEventListener(
  el,
  opened,
  close
)

// Methods
const openUpdated = () => {
  if (!opened.value) {
    open()
    currentPeriod.value = getPeriodFromValue(props.modelValue)
    addCloseEvents()
  }
}

const closeUpdated = () => {
  if (opened.value) {
    close()
    removeCloseEvents()
  }
}

const handleInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    const userDate = parseDateString(e.target.value)
    inputValue.value = e.target.value

    emit(
      'update:modelValue',
      userDate ? formatDateToString(userDate) : e.target.value
    )
  }
}

const closeViaOverlay = (e: Event) => {
  if (e.target === outerWrap.value) {
    closeUpdated()
  }
}

const incrementMonth = (increment: number) => {
  const refDate = new Date(currentPeriod.value.year, currentPeriod.value.month)
  const incrementDate = new Date(
    refDate.getFullYear(),
    refDate.getMonth() + increment
  )

  currentPeriod.value = {
    month: incrementDate.getMonth(),
    year: incrementDate.getFullYear(),
  }
}

const yearRange = computed(() => {
  const currentYear = currentPeriod.value.year
  let yearsRange = []

  yearsRange = range(currentYear - 10, currentYear + 10)

  if (yearsRange.indexOf(currentYear) < 0) {
    yearsRange.push(currentYear)
    yearsRange = yearsRange.sort()
  }

  return yearsRange
})

const currentPeriodDates = computed(() => {
  const dates = generateCalendarDates(
    currentPeriod.value.year,
    currentPeriod.value.month
  ).map((day) => ({
    date: day,
    outOfRange: day.getMonth() !== currentPeriod.value.month,
    disabled: props.isDateDisabled(day),
    today: isToday(day),
    dateKey: formatDateToString(day),
    selected: props.modelValue
      ? isSameDay(day, parseDateString(props.modelValue))
      : false,
  }))
  return chunkArray<EnhancedDay>(dates, 7)
})

const valueDate = computed(() => {
  const value = props.modelValue
  return value ? parseDateString(value) : undefined
})

const selectDateItem = (item: EnhancedDay) => {
  if (!item.disabled) {
    const newDate = new Date(item.date)
    emit('update:modelValue', formatDateToString(newDate))
    closeUpdated()
  }
}

const isValidValue = computed(() => {
  const valueDateRef = valueDate.value
  return props.modelValue ? Boolean(valueDateRef) : true
})

watch(
  () => props.modelValue,
  (value) => {
    if (isValidValue) {
      inputValue.value = valueToInputFormat(value)
      currentPeriod.value = getPeriodFromValue(value)
    }
  }
)
</script>

<template>
  <div ref="el" class="datepicker">
    <slot
      :open="openUpdated"
      :close="closeUpdated"
      :toggle="toggle"
      :input-value="inputValue"
      :process-user-input="handleInput"
      :value-to-input-format="valueToInputFormat"
    >
      <input
        id="day-input"
        ref="datepickerInput"
        type="text"
        name="date-picker"
        class="datepicker__input"
        autocomplete="off"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :value="inputValue"
        @input="handleInput"
        @focus="openUpdated()"
        @click="openUpdated()"
      />
    </slot>
    <transition name="vdp-toggle-calendar">
      <div
        v-if="opened"
        ref="outerWrap"
        class="datepicker__outer-wrap"
        @click="closeViaOverlay"
      >
        <div class="datepicker__inner-wrap">
          <header class="datepicker__header">
            <button
              class="datepicker__button datepicker__button--prev"
              title="Previous month"
              type="button"
              @click="incrementMonth(-1)"
            >
              Previous month
            </button>
            <button
              class="datepicker__button datepicker__button--next"
              type="button"
              title="Next month"
              @click="incrementMonth(1)"
            >
              Next month
            </button>
            <div class="datepicker__period-controls">
              <div class="datepicker__period-control">
                <button
                  :key="currentPeriod.month"
                  type="button"
                  class="datepicker__month-button"
                >
                  {{ months[currentPeriod.month] }}
                </button>
                <select
                  v-model="currentPeriod.month"
                  class="datepicker__month-select"
                >
                  <option
                    v-for="(month, index) in months"
                    :key="month"
                    :value="index"
                  >
                    {{ month }}
                  </option>
                </select>
              </div>
              <div class="datepicker__period-control">
                <button
                  :key="currentPeriod.year"
                  type="button"
                  class="datepicker__year-button"
                >
                  {{ currentPeriod.year }}
                </button>
                <select
                  v-model="currentPeriod.year"
                  class="datepicker__year-select"
                >
                  <option v-for="year in yearRange" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
          </header>
          <table class="datepicker__table">
            <thead>
              <tr>
                <th
                  v-for="(weekday, weekdayIndex) in weekdays"
                  :key="weekdayIndex"
                  class="datepicker__head-cell"
                >
                  <span class="datepicker__head-cell-content">{{
                    weekday
                  }}</span>
                </th>
              </tr>
            </thead>
            <tbody :key="currentPeriod.year + '-' + currentPeriod.month">
              <tr
                v-for="(week, weekIndex) in currentPeriodDates"
                :key="weekIndex"
                class="datepicker__row"
              >
                <td
                  v-for="item in week"
                  :key="item.dateKey"
                  :class="[
                    'datepicker__cell',
                    {
                      'datepicker__cell--selectable': !item.disabled,
                      'datepicker__cell--selected': item.selected,
                      'datepicker__cell--disabled': item.disabled,
                      'datepicker__cell--today': item.today,
                      'datepicker__cell--out-of-range': item.outOfRange,
                    },
                  ]"
                  :data-id="item.dateKey"
                  @click="selectDateItem(item)"
                >
                  <slot name="cellContent" :item="item">
                    <div class="datepicker__cell-content">
                      {{ item.date.getDate() }}
                    </div>
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import url('./DatePicker.scss');
</style>
