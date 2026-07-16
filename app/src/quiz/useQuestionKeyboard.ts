import { useEffect } from 'react'

interface QuestionKeyboardOptions {
  answerIds: string[]
  selectedId: string | null
  onSelect: (answerId: string) => void
  onConfirm: () => void
}

export function useQuestionKeyboard({
  answerIds,
  selectedId,
  onSelect,
  onConfirm,
}: QuestionKeyboardOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || answerIds.length === 0) return
      const target = event.target
      if (target instanceof HTMLElement && target.closest('button, a, summary, select, textarea, input:not([type="radio"])')) return

      if (event.key === 'Enter' && selectedId && !event.repeat) {
        event.preventDefault()
        onConfirm()
        return
      }

      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
      if (direction === 0) return

      event.preventDefault()
      const currentIndex = selectedId ? answerIds.indexOf(selectedId) : -1
      const nextIndex = currentIndex < 0
        ? direction > 0 ? 0 : answerIds.length - 1
        : (currentIndex + direction + answerIds.length) % answerIds.length
      onSelect(answerIds[nextIndex])
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [answerIds, onConfirm, onSelect, selectedId])
}
