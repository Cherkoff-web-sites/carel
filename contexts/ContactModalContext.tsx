'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import ContactModal from '@/components/ContactModal/ContactModal'

type ContactModalContextType = {
  openContactModal: () => void
  closeContactModal: () => void
  isOpen: boolean
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(
  undefined
)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openContactModal = useCallback(() => setIsOpen(true), [])
  const closeContactModal = useCallback(() => setIsOpen(false), [])

  return (
    <ContactModalContext.Provider
      value={{ openContactModal, closeContactModal, isOpen }}
    >
      {children}
      <ContactModal isOpen={isOpen} onClose={closeContactModal} />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const context = useContext(ContactModalContext)
  if (!context) {
    throw new Error('useContactModal must be used within ContactModalProvider')
  }
  return context
}
