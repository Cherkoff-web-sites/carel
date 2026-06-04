'use client'

import { useEffect, useState, type FormEvent } from 'react'

type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false)
      return
    }

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
  }, [isOpen, onClose])

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
        <h2 id="contact-modal-title" className="sr-only">
          Заявка на обратный звонок
        </h2>

        {submitted ? (
          <div className="py-4 text-center">
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
            <button
              type="submit"
              className="mt-1 w-full rounded-[5px] bg-[#E62614] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90"
            >
              Перезвонить мне
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
