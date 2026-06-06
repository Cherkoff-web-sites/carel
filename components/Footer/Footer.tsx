import Image from 'next/image'

const contactItems = [
  {
    id: 'email',
    href: 'mailto:servicecarel@yandex.ru',
    label: 'servicecarel@yandex.ru',
    icon: (
      <svg className="h-[26px] w-[26px] shrink-0" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <path
          d="M21.6667 4.33203H4.33335C3.14169 4.33203 2.17752 5.30703 2.17752 6.4987L2.16669 19.4987C2.16669 20.6904 3.14169 21.6654 4.33335 21.6654H21.6667C22.8584 21.6654 23.8334 20.6904 23.8334 19.4987V6.4987C23.8334 5.30703 22.8584 4.33203 21.6667 4.33203ZM21.2334 8.9362L13.5742 13.7245C13.2275 13.9412 12.7725 13.9412 12.4259 13.7245L4.76669 8.9362C4.65806 8.87522 4.56293 8.79283 4.48707 8.69402C4.4112 8.59522 4.35617 8.48204 4.32531 8.36135C4.29445 8.24066 4.2884 8.11496 4.30752 7.99186C4.32665 7.86877 4.37055 7.75083 4.43658 7.64519C4.5026 7.53955 4.58937 7.44841 4.69164 7.37728C4.79391 7.30614 4.90955 7.2565 5.03156 7.23135C5.15357 7.20621 5.27941 7.20608 5.40147 7.23098C5.52353 7.25587 5.63927 7.30528 5.74169 7.3762L13 11.9154L20.2584 7.3762C20.3608 7.30528 20.4765 7.25587 20.5986 7.23098C20.7206 7.20608 20.8465 7.20621 20.9685 7.23135C21.0905 7.2565 21.2061 7.30614 21.3084 7.37728C21.4107 7.44841 21.4974 7.53955 21.5635 7.64519C21.6295 7.75083 21.6734 7.86877 21.6925 7.99186C21.7116 8.11496 21.7056 8.24066 21.6747 8.36135C21.6439 8.48204 21.5888 8.59522 21.513 8.69402C21.4371 8.79283 21.342 8.87522 21.2334 8.9362Z"
          fill="#F8F8F8"
        />
      </svg>
    ),
  },
  {
    id: 'phone',
    href: 'tel:+79295385634',
    label: '8 (929) 538-56-34',
    icon: (
      <svg className="h-[26px] w-[26px] shrink-0" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <path
          d="M8.66668 3.25C9.20834 3.25 11.375 8.125 11.375 8.66667C11.375 9.75 9.75001 10.8333 9.20834 11.9167C8.66668 13 9.75001 14.0833 10.8333 15.1667C11.2558 15.5892 13 17.3333 14.0833 16.7917C15.1667 16.25 16.25 14.625 17.3333 14.625C17.875 14.625 22.75 16.7917 22.75 17.3333C22.75 19.5 21.125 21.125 19.5 21.6667C17.875 22.2083 16.7917 22.2083 14.625 21.6667C12.4583 21.125 10.8333 20.5833 8.12501 17.875C5.41668 15.1667 4.87501 13.5417 4.33334 11.375C3.79168 9.20833 3.79168 8.125 4.33334 6.5C4.87501 4.875 6.50001 3.25 8.66668 3.25Z"
          fill="#FDFBF6"
          stroke="#F8F8F8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'address',
    href: null as string | null,
    label: ['ул. Касимовская вл. 26, пом. 406', '115404, г. Москва'],
    icon: (
      <svg className="h-[26px] w-[26px] shrink-0" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <path
          d="M13 12.4596C12.2817 12.4596 11.5928 12.1743 11.0849 11.6664C10.577 11.1585 10.2917 10.4696 10.2917 9.7513C10.2917 9.03301 10.577 8.34413 11.0849 7.83622C11.5928 7.32831 12.2817 7.04297 13 7.04297C13.7183 7.04297 14.4072 7.32831 14.9151 7.83622C15.423 8.34413 15.7083 9.03301 15.7083 9.7513C15.7083 10.107 15.6383 10.4591 15.5022 10.7877C15.3661 11.1163 15.1666 11.4149 14.9151 11.6664C14.6636 11.9179 14.365 12.1174 14.0364 12.2535C13.7078 12.3896 13.3557 12.4596 13 12.4596ZM13 2.16797C10.9888 2.16797 9.05993 2.96692 7.63778 4.38908C6.21563 5.81123 5.41667 7.74008 5.41667 9.7513C5.41667 15.4388 13 23.8346 13 23.8346C13 23.8346 20.5833 15.4388 20.5833 9.7513C20.5833 7.74008 19.7844 5.81123 18.3622 4.38908C16.9401 2.96692 15.0112 2.16797 13 2.16797Z"
          fill="#F8F8F8"
        />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-[#232326] py-[55px] text-white">
        <div className="container">
          <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12">
            <span className="heading-line" aria-hidden />
            <h2 className="shrink-0 text-center text-xl sm:text-2xl lg:text-3xl">
              Контакты
            </h2>
            <span className="heading-line" aria-hidden />
          </div>

          <div className="mx-auto w-max max-w-full sm:w-full">
            <ul className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-6 lg:gap-x-14">
              {contactItems.map((item) => {
                const content =
                  typeof item.label === 'string' ? (
                    item.label
                  ) : (
                    <>
                      {item.label.map((line, index) => (
                        <span key={line} className={index > 0 ? 'block' : undefined}>
                          {line}
                        </span>
                      ))}
                    </>
                  )

                return (
                  <li
                    key={item.id}
                    className="flex w-full items-start gap-3 text-left sm:w-auto sm:max-w-none"
                  >
                    <span className="mt-0.5 flex shrink-0">{item.icon}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="min-w-0 flex-1 text-sm leading-relaxed text-white/95 transition-colors hover:text-[#E62614] sm:flex-none sm:text-base"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="min-w-0 flex-1 text-sm leading-relaxed text-white/95 sm:flex-none sm:text-base">
                        {content}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
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
