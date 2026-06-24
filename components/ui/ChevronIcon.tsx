type ChevronIconProps = {
  className?: string
}

function resolveIconClass(className?: string) {
  if (!className) {
    return 'h-4 w-4 shrink-0'
  }

  const hasSize = /\b[hw]-/.test(className)
  const withShrink = className.includes('shrink-0') ? className : `${className} shrink-0`

  return hasSize ? withShrink : `h-4 w-4 shrink-0 ${className}`
}

export function ChevronLeftIcon({ className }: ChevronIconProps) {
  return (
    <svg
      className={resolveIconClass(className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M10 4L6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronRightIcon({ className }: ChevronIconProps) {
  return (
    <svg
      className={resolveIconClass(className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDownIcon({ className }: ChevronIconProps) {
  return (
    <svg
      className={resolveIconClass(className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
