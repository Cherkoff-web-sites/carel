'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useContactModal } from '@/contexts/ContactModalContext'

type ContactModalTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function ContactModalTrigger({
  children,
  className = '',
  type = 'button',
  onClick,
  ...props
}: ContactModalTriggerProps) {
  const { openContactModal } = useContactModal()

  return (
    <button
      type={type}
      className={className}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          openContactModal()
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}
