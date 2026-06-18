'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import ContactModal from '@/components/ContactModal/ContactModal'
import type { ContactModalView } from '@/lib/constants'

type ContactModalContextType = {
  openContactModal: (view?: ContactModalView) => void
  closeContactModal: () => void
  isOpen: boolean
  initialView: ContactModalView
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(
  undefined
)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialView, setInitialView] = useState<ContactModalView>('form')

  const openContactModal = useCallback((view: ContactModalView = 'form') => {
    setInitialView(view)
    setIsOpen(true)
  }, [])

  const closeContactModal = useCallback(() => setIsOpen(false), [])

  return (
    <ContactModalContext.Provider
      value={{ openContactModal, closeContactModal, isOpen, initialView }}
    >
      {children}
      <ContactModal
        isOpen={isOpen}
        initialView={initialView}
        onClose={closeContactModal}
      />
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
