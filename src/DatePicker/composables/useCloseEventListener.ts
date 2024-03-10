import { Ref, onBeforeUnmount, ref } from 'vue'

type CloseEventListener = EventListenerOrEventListenerObject | undefined

export const useCloseEventListener = (
  el: Ref<Element | null>,
  isOpen: Ref<boolean>,
  close: () => void
) => {
  const closeEventListener = ref<CloseEventListener>(undefined)

  const addCloseEvents = () => {
    if (!closeEventListener.value) {
      closeEventListener.value = (event: Event) => {
        if ((event as KeyboardEvent).key) {
          ;(event as KeyboardEvent).key === 'Escape' && close()
        } else if (
          !(event.target === el.value) &&
          !el.value?.contains(event.target as Node)
        ) {
          close()
        }
      }
      ;['click', 'keyup', 'focusin'].forEach((eventName) =>
        document.addEventListener(eventName, closeEventListener.value!)
      )
    }
  }

  const removeCloseEvents = () => {
    if (closeEventListener.value) {
      ;['click', 'keyup', 'focusin'].forEach((eventName) =>
        document.removeEventListener(eventName, closeEventListener.value!)
      )

      closeEventListener.value = undefined
    }
  }

  onBeforeUnmount(removeCloseEvents)

  return { addCloseEvents, removeCloseEvents, isOpen }
}
