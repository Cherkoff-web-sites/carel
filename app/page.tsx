import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import { HOME_SERVICES } from '@/lib/servicesData'

// SSG - статическая генерация для SEO
export const metadata: Metadata = {
  title: 'Главная | CAREL Professional Service',
  description:
    'Профессиональный сервис увлажнителей CAREL: монтаж, диагностика, обслуживание, комплектующие и запчасти.',
}

// Эта страница будет сгенерирована статически при сборке
export default function HomePage() {
  const heroBgImage = '/images/hero/hero-bg.png'
  const heroMainImage = '/images/hero/hero-main-device.png'

  const heroDeviceBoxStyle = {
    left: 'calc(max(0px, (100vw - 1600px) / 2) + min(640px, 640 * 100vw / 1920))',
    width: 'min(1035px, calc(1035 * 100vw / 1920))',
  } as const

  const container1100 = 'mx-auto w-full max-w-[1100px] px-4'
  const customerChoiceBgImage = '/images/customer-choice/bg.png'

  const customerChoiceProducts = [
    {
      id: 'heatersteam',
      title: 'heatrSteam',
      subtitle: 'увлажнители с электронагревателем',
      image: '/images/customer-choice/heatrsteam.png',
      href: '/catalog?id=heatersteam',
    },
    {
      id: 'humidisk',
      title: 'humiDisk',
      subtitle: 'дисковые увлажнители',
      image: '/images/customer-choice/humidisk.png',
      href: '/catalog?id=humidisk',
    },
    {
      id: 'humisteam',
      title: 'humiSteam',
      subtitle: 'увлажнители с погружными электродами',
      image: '/images/customer-choice/humisteam.png',
      href: '/catalog?id=humisteam',
    },
  ] as const

  const partsAccessoriesCategories = [
    {
      id: 'components',
      title: 'Комплектующие',
      image: '/images/parts-accessories/components.png',
      href: '/components',
    },
    {
      id: 'spare-parts',
      title: 'Запчасти',
      image: '/images/parts-accessories/spare-parts.png',
      href: '/components',
    },
  ] as const

  const homeFeatures = [
    {
      icon: '/images/features/icon-optimal-prices.svg',
      title: 'Оптимальные цены',
      text: 'работа напрямую с производителем',
    },
    {
      icon: '/images/features/icon-warranty.svg',
      title: 'Гарантия до 3 лет',
      text: 'расширенная гарантия до трёх лет на увлажнители',
    },
    {
      icon: '/images/features/icon-assortment.svg',
      title: 'Большой ассортимент',
      text: 'всегда в наличии большой ассортимент комплектующих',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Первый блок — фон через CSS background-image (без img в разметке) */}
      <section
        className="relative bg-cover bg-center bg-no-repeat pt-[250px] pb-[250px]"
        style={{ backgroundImage: `url('${heroBgImage}')` }}
      >
        <div className="container">
          <div className="max-w-[770px] relative z-10">
            <h1 className="mb-6 text-4xl uppercase leading-[1.08] tracking-[0.01em] sm:text-5xl lg:text-6xl">
              <span className="text-white">Профессиональный</span>
              <br />
              <span className="text-white">сервис увлажнителей</span>
              <br />
              <span className="text-[#E62614]">Carel</span>
            </h1>
            <p className="mb-8 max-w-[645px] text-base leading-relaxed text-white/85">
              Наши специалисты не просто монтируют и обслуживают системы - они создают
              атмосферу, в которой ваше оборудование, люди и процессы работают в идеальной гармонии.
            </p>
            <div className="flex">
              <ContactModalTrigger className="rounded-[5px] bg-[#E62614] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[#E62614]/90">
                Бесплатная консультация
              </ContactModalTrigger>
            </div>
          </div>

          <div className="mt-12 flex justify-center lg:hidden">
            <Image
              src={heroMainImage}
              alt="Промышленный увлажнитель"
              width={560}
              height={360}
              className="h-auto w-full max-w-md object-contain"
              priority
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 right-auto top-auto z-0 hidden max-w-none lg:block"
          style={heroDeviceBoxStyle}
          aria-hidden
        >
          <Image
            src={heroMainImage}
            alt=""
            width={1035}
            height={680}
            className="h-auto w-full max-w-full object-contain object-left"
            priority
          />
        </div>
      </section>

      {/* Преимущества — без зазора под hero */}
      <section className="mt-0 bg-[#232326] py-10 sm:py-12">
        <div className="container">
          <ul className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-3 lg:gap-8">
            {homeFeatures.map((item) => (
              <li key={item.title} className="flex gap-4 sm:gap-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center sm:h-16 sm:w-16">
                  <Image
                    src={item.icon}
                    alt=""
                    width={64}
                    height={64}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-white sm:text-lg">{item.title}</p>
                  <p className="mt-1 max-w-[230px] text-sm leading-relaxed text-white/85 sm:text-base">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Наши услуги — картинки: public/images/home-services/ (см. массив homeServicesBlock) */}
      <section className="bg-[#fdfbf6] py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="relative mb-10 flex w-full items-center sm:mb-12">
            <span
              className="invisible shrink-0 rounded-[5px] border border-transparent px-5 py-2.5 text-sm font-bold"
              aria-hidden
            >
              Смотреть все
            </span>
            <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-4">
              <span className="heading-line" aria-hidden />
              <h2 className="shrink-0 text-center text-2xl text-[#232326] sm:text-3xl lg:text-4xl">
                Наши услуги
              </h2>
              <span className="heading-line" aria-hidden />
            </div>
            <Link
              href="/services/maintenance"
              className="relative z-10 ml-auto shrink-0 rounded-[5px] border border-[#232326] bg-white px-5 py-2.5 text-sm font-bold text-[#232326] transition-colors hover:bg-[#232326]/5"
            >
              Смотреть все
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {(
              [
                { slug: 'diagnostics', image: '/images/home-services/diagnostics.png' },
                { slug: 'installation', image: '/images/home-services/installation.png' },
                { slug: 'pnr', image: '/images/home-services/pnr.png' },
                { slug: 'maintenance', image: '/images/home-services/maintenance.png' },
              ] as const
            ).map((card) => {
              const service = HOME_SERVICES.find((s) => s.slug === card.slug)!
              return (
              <li
                key={card.slug}
                className="group flex flex-col overflow-hidden rounded-lg border border-[#232326]/15 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/services/${card.slug}`}
                  className="relative aspect-[375/211] w-full bg-[#e8e6e1]"
                >
                  <Image
                    src={card.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </Link>
                <div className="flex min-h-[180px] flex-1 flex-col items-center justify-between gap-6 bg-[#232326] p-6 text-center transition-colors duration-300 group-hover:bg-[#E62614]">
                  <Link href={`/services/${card.slug}`}>
                    <h3 className="text-lg font-bold uppercase leading-snug tracking-wide text-white sm:text-xl">
                      {service.title}
                    </h3>
                  </Link>
                  <ContactModalTrigger className="w-fit rounded-[5px] border border-transparent bg-[#E62614] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E62614]/90 group-hover:border-[#232326] group-hover:bg-white group-hover:text-[#232326] group-hover:hover:bg-[#fdfbf6]">
                    Заказать услугу
                  </ContactModalTrigger>
                </div>
              </li>
              )
            })}
          </ul>

          <div className="mx-auto mt-12 max-w-4xl sm:mt-14 lg:mt-16">
            <p className="border-l-4 border-[#232326] px-[22px] py-[8px] text-left text-[20px] leading-relaxed text-[#232326] lg:text-[25px]">
              Требуется экспертная помощь по увлажнению? Позвоните или оставьте заявку — мы предложим
              лучшее решение для вашего объекта
            </p>
            <div className="mt-8 flex justify-center sm:mt-10">
              <ContactModalTrigger className="inline-flex w-fit items-center justify-center rounded-[5px] bg-[#E62614] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90">
                Связаться с инженером
              </ContactModalTrigger>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-[#fdfbf6] pt-12 sm:pt-16 lg:pt-20">
          <div className={container1100}>
            <div className="relative mb-10 flex w-full items-center sm:mb-12">
              <span
                className="invisible shrink-0 rounded-[5px] border border-transparent px-5 py-2.5 text-sm font-bold"
                aria-hidden
              >
                Смотреть все
              </span>
              <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-4">
                <span className="heading-line" aria-hidden />
                <h2 className="shrink-0 text-center text-2xl text-[#232326] sm:text-3xl lg:text-4xl">
                  Каталог
                </h2>
                <span className="heading-line" aria-hidden />
              </div>
              <Link
                href="/catalog"
                className="relative z-10 ml-auto shrink-0 rounded-[5px] border border-[#232326] bg-white px-5 py-2.5 text-sm font-bold text-[#232326] transition-colors hover:bg-[#232326]/5"
              >
                Смотреть все
              </Link>
            </div>
          </div>
        </div>

        <div
          className="relative bg-cover bg-center bg-no-repeat py-[40px]"
          style={{ backgroundImage: `url('${customerChoiceBgImage}')` }}
        >
          <div className={container1100}>
            <ul className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
              {customerChoiceProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex h-full w-[min(300px,calc(100vw-2rem))] shrink-0 snap-center lg:w-auto"
                >
                  <Link
                    href={product.href}
                    className="group flex h-full w-full flex-col overflow-hidden rounded-none transition-[filter] hover:[filter:drop-shadow(1px_1px_21.6px_rgba(255,255,255,0.27))] active:[filter:drop-shadow(1px_1px_21.6px_rgba(255,255,255,0.27))]"
                  >
                    <div className="relative aspect-square bg-white">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-6 sm:p-8"
                        sizes="(max-width: 1024px) 85vw, 33vw"
                      />
                    </div>
                    <div className="flex min-h-[125px] flex-1 flex-col items-center justify-start bg-[#e8e6e1] px-5 py-[15px] text-center transition-colors duration-300 group-hover:bg-[#E62614] group-active:bg-[#E62614] sm:px-6">
                      <h3 className="shrink-0 text-[25px] font-normal leading-tight text-[#232326] transition-colors duration-300 group-hover:text-white group-active:text-white lg:text-[30px]">
                        {product.title}
                      </h3>
                      <p className="mt-2 max-w-[18rem] shrink-0 text-sm font-normal leading-snug text-[#232326]/85 transition-colors duration-300 group-hover:text-white/95 group-active:text-white/95 sm:text-base">
                        {product.subtitle}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="parts-accessories"
        className="bg-[#fdfbf6] py-12 scroll-mt-[82px] sm:py-16 lg:py-20"
      >
        <div className={container1100}>
          <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12 lg:mb-14">
            <span className="heading-line" aria-hidden />
            <h2 className="shrink-0 text-center text-2xl text-[#232326] sm:text-3xl lg:text-4xl">
              Комплектующие и запчасти
            </h2>
            <span className="heading-line" aria-hidden />
          </div>

          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {partsAccessoriesCategories.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group relative block aspect-square w-full overflow-hidden bg-[#e8e6e1]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-[#232326]/0 transition-colors duration-300 group-hover:bg-[#232326]/70"
                    aria-hidden
                  />
                  <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-[25px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:text-[40px]">
                    {item.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  )
}

