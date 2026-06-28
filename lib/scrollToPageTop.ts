export function scrollToPageTop(behavior: ScrollBehavior = 'smooth') {
  window.scrollTo({ top: 0, left: 0, behavior })
}

export function scrollToElement(
  element: HTMLElement | null | undefined,
  behavior: ScrollBehavior = 'smooth'
) {
  if (!element) {
    return
  }

  requestAnimationFrame(() => {
    element.scrollIntoView({ behavior, block: 'start' })
  })
}
