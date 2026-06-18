'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useContactModal } from '@/contexts/ContactModalContext'
import type { ContactModalView } from '@/lib/constants'

type ContactModalTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  modalView?: ContactModalView
}

export default function ContactModalTrigger({
  children,
  className = '',
  type = 'button',
  modalView = 'form',
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
          openContactModal(modalView)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}
