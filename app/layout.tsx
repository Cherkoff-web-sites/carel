import type { Metadata } from 'next'
import { PT_Sans, PT_Sans_Caption } from 'next/font/google'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { CartProvider } from '@/contexts/CartContext'
import CartToast from '@/components/cart/CartToast'
import ChatWidget from '@/components/ChatWidget/ChatWidget'
import { ContactModalProvider } from '@/contexts/ContactModalContext'
import './globals.css'

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

const ptSansCaption = PT_Sans_Caption({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-pt-sans-caption',
})

export const metadata: Metadata = {
  title: 'CAREL Professional Service',
  description: 'Профессиональный сервис увлажнителей CAREL: монтаж, обслуживание, комплектующие и запчасти.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={ptSansCaption.variable}>
      <body className={ptSans.className}>
        <CartProvider>
          <ContactModalProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex flex-grow flex-col">{children}</main>
              <Footer />
            </div>
            <ChatWidget />
            <CartToast />
          </ContactModalProvider>
        </CartProvider>
      </body>
    </html>
  )
}
