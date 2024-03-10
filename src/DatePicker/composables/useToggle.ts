import { ref } from 'vue'

export function useToggle(initialValue: boolean) {
  const opened = ref(initialValue)

  const toggle = () => {
    opened.value = !opened.value
  }

  const open = () => {
    if (!opened.value) {
      opened.value = true
    }
  }

  const close = () => {
    if (opened.value) {
      opened.value = false
    }
  }

  return { opened, toggle, open, close }
}
