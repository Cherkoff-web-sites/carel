'use client'

import Image from 'next/image'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'

export default function ChatWidget() {
  return (
    <ContactModalTrigger
      className="fixed bottom-5 right-4 z-40 h-14 w-14 transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:h-[82px] sm:w-[82px]"
      aria-label="Открыть чат"
    >
      <Image
        src="/images/icons/chat.svg"
        alt=""
        width={82}
        height={82}
        className="h-14 w-14 sm:h-[82px] sm:w-[82px]"
      />
    </ContactModalTrigger>
  )
}
