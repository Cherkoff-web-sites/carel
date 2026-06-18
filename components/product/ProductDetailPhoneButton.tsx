'use client'

import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'

export default function ProductDetailPhoneButton() {
  return (
    <ContactModalTrigger
      modalView="call"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#232326] text-white transition-colors hover:bg-[#232326]/85 sm:h-11 sm:w-11"
      aria-label="Позвонить инженеру"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
          fill="currentColor"
        />
      </svg>
    </ContactModalTrigger>
  )
}
