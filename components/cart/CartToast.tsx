'use client'

import { useCart } from '@/contexts/CartContext'

export default function CartToast() {
  const { toastMessage } = useCart()

  if (!toastMessage) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <p className="cart-toast-enter rounded-[5px] bg-[#232326] px-5 py-3 text-center text-sm font-medium text-white shadow-lg sm:text-base">
        {toastMessage}
      </p>
    </div>
  )
}
