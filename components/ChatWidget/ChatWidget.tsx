'use client'

import Image from 'next/image'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'

export default function ChatWidget() {
  return (
    <ContactModalTrigger
      className="fixed bottom-6 right-4 z-40 h-[82px] w-[82px] transition-transform hover:scale-105 sm:right-6"
      aria-label="Открыть чат"
    >
      <Image
        src="/images/icons/chat.svg"
        alt=""
        width={82}
        height={82}
        className="h-[82px] w-[82px]"
      />
    </ContactModalTrigger>
  )
}
