'use client'

import { useEffect, useState, type FormEvent } from 'react'
import PersonalDataConsent from '@/components/legal/PersonalDataConsent'
import {
  SITE_PHONE,
  SITE_PHONE_DISPLAY,
  type ContactModalView,
} from '@/lib/constants'

type ContactModalProps = {
  isOpen: boolean
  initialView: ContactModalView
  onClose: () => void
}

export default function ContactModal({
  isOpen,
  initialView,
  onClose,
}: ContactModalProps) {
  const [view, setView] = useState<ContactModalView>(initialView)
  const [submitted, setSubmitted] = useState(false)
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false)
      return
    }

    setView(initialView)
    setSubmitted(false)
    setConsent(false)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, initialView, onClose])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Закрыть"
      />

      <div className="relative z-10 w-full max-w-[400px] rounded-[5px] bg-white p-8 shadow-xl sm:p-10">
        {view === 'call' && !submitted ? (
          <div className="py-2 text-center">
            <h2
              id="contact-modal-title"
              className="text-lg font-medium text-[#232326] sm:text-xl"
            >
              Номер для звонка
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#232326]/70 sm:text-base">
              Если вы готовы позвонить прямо сейчас
            </p>
            <a
              href={`tel:${SITE_PHONE}`}
              className="mt-6 block text-2xl font-bold text-[#E62614] transition-colors hover:text-[#E62614]/85 sm:text-3xl"
            >
              {SITE_PHONE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={() => setView('form')}
              className="mt-8 w-full text-sm leading-relaxed text-[#232326]/75 underline-offset-2 transition-colors hover:underline sm:text-base"
            >
              заполнить заявку на{' '}
              <span className="font-medium text-[#E62614] hover:text-[#E62614]/85">
                Обратную связь
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-[5px] border border-[#232326]/15 bg-white px-8 py-3 text-base font-semibold text-[#232326] transition-colors hover:bg-[#232326]/5"
            >
              Закрыть
            </button>
          </div>
        ) : submitted ? (
          <div className="py-4 text-center">
            <h2 id="contact-modal-title" className="sr-only">
              Заявка на обратный звонок
            </h2>
            <p className="text-lg font-medium text-[#232326]">Спасибо!</p>
            <p className="mt-2 text-base text-[#232326]/80">
              Мы свяжемся с вами в ближайшее время.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-[5px] bg-[#E62614] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <h2 id="contact-modal-title" className="sr-only">
              Заявка на обратный звонок
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Имя"
                className="w-full rounded-[5px] bg-[#c8c8c8] px-4 py-3.5 text-base text-[#232326] placeholder:text-white/95 focus:outline-none focus:ring-2 focus:ring-[#E62614]/40"
              />
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                placeholder="Телефон"
                className="w-full rounded-[5px] bg-[#c8c8c8] px-4 py-3.5 text-base text-[#232326] placeholder:text-white/95 focus:outline-none focus:ring-2 focus:ring-[#E62614]/40"
              />
              <input
                type="text"
                name="reason"
                placeholder="Причина обращения"
                className="w-full rounded-[5px] bg-[#c8c8c8] px-4 py-3.5 text-base text-[#232326] placeholder:text-white/95 focus:outline-none focus:ring-2 focus:ring-[#E62614]/40"
              />
              <PersonalDataConsent
                id="contact-modal-consent"
                checked={consent}
                onChange={setConsent}
              />
              <button
                type="submit"
                disabled={!consent}
                className="mt-1 w-full rounded-[5px] bg-[#E62614] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Перезвонить мне
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
