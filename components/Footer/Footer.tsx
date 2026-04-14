import Image from 'next/image'

const contactItems = [
  {
    id: 'email',
    href: 'mailto:servicecarel@yandex.ru',
    label: 'servicecarel@yandex.ru',
    icon: (
      <svg className="h-5 w-5 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'phone',
    href: 'tel:+79295385634',
    label: '8 (929) 538-56-34',
    icon: (
      <svg className="h-5 w-5 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: 'address',
    href: null as string | null,
    label: 'ул. Касимовская вл. 26, пом. 406 115404, г. Москва',
    icon: (
      <svg className="h-5 w-5 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-[#232326] py-14 text-white sm:py-16 lg:py-20">
        <div className="container">
          <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12">
            <span className="h-px min-w-[2rem] flex-1 max-w-[8rem] bg-[#E62614] sm:max-w-[12rem]" aria-hidden />
            <h2 className="shrink-0 text-center text-xl font-semibold sm:text-2xl lg:text-3xl">
              Контакты
            </h2>
            <span className="h-px min-w-[2rem] flex-1 max-w-[8rem] bg-[#E62614] sm:max-w-[12rem]" aria-hidden />
          </div>

          <ul className="flex flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-6 lg:gap-x-14">
            {contactItems.map((item) => (
              <li key={item.id} className="flex max-w-md items-start gap-3 text-center sm:max-w-none sm:text-left">
                <span className="mt-0.5 flex shrink-0 justify-center sm:justify-start">{item.icon}</span>
                {item.href ? (
                  <a href={item.href} className="text-sm leading-relaxed text-white/95 hover:text-[#E62614] transition-colors sm:text-base">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-sm leading-relaxed text-white/95 sm:text-base">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#fdfbf6] py-8 sm:py-10">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-10 lg:gap-14">
            <Image
              src="/images/header/logo-carel-works.svg"
              alt="CAREL Works"
              width={160}
              height={56}
              className="h-12 w-auto md:h-14"
            />
            <p className="max-w-xl text-center text-xs leading-relaxed text-[#232326]/55 md:max-w-none md:text-left md:text-sm">
              2022 © «CAREL Professional Service» Все права защищены
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
