import { CONTACTS_ANCHOR_ID } from '@/lib/constants'

export function scrollToContacts() {
  document.getElementById(CONTACTS_ANCHOR_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
