import type { Metadata } from 'next'
// import Link from 'next/link' // временно: ссылки с главной отключены
import Image from 'next/image'
import Button from '@/components/ui/Button'
import RealizedProjectsSlider from '@/components/home/RealizedProjectsSlider'

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

  const customerChoiceProducts = [
    {
      id: 'heatrsteam',
      title: 'heatrSteam',
      subtitle: 'увлажнители с электронагревателем',
      image: '/images/customer-choice/heatrsteam.png',
    },
    {
      id: 'humidisk',
      title: 'humiDisk',
      subtitle: 'дисковые увлажнители',
      image: '/images/customer-choice/humidisk.png',
    },
    {
      id: 'humisteam',
      title: 'humiSteam',
      subtitle: 'увлажнители с погружными электродами',
      image: '/images/customer-choice/humisteam.png',
    },
  ] as const

  const partsAccessoriesCategories = [
    {
      id: 'components',
      title: 'Комплектующие',
      image: '/images/parts-accessories/components.png',
    },
    {
      id: 'spare-parts',
      title: 'Запчасти',
      image: '/images/parts-accessories/spare-parts.png',
    },
  ] as const

  const realizedProjects = [
    {
      id: 'skolkovo',
      title: 'Школа управления Сколково',
      subtitle: 'Монтаж увлажнителя humiSteam на 65кг/ч',
      image: '/images/realized-projects/skolkovo.png',
    },
    {
      id: 'khilkov',
      title: 'Квартира на Хилков переулке',
      subtitle: 'Монтаж 2× UR006',
      image: '/images/realized-projects/khilkov.png',
    },
    {
      id: 'ooo-art-courier',
      title: 'ООО АРТ - Курьер Склад хранения произведений искусства',
      subtitle:
        'Монтаж 4-х увлажнителей humiSteam X-plus на 8кг/ч с вентиляторными парораспределителями',
      image: '/images/realized-projects/ooo-art-courier.png',
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.08] uppercase tracking-[0.01em]">
              <span className="text-white">Профессиональный</span>
              <br />
              <span className="text-white">сервис увлажнителей</span>
              <br />
              <span className="text-[#E62614]">Carel</span>
            </h1>
            <p className="text-base text-white/85 mb-8 leading-relaxed">
              Наши специалисты не просто монтируют и обслуживают системы - они создают
              атмосферу, в которой ваше оборудование, люди и процессы работают в идеальной гармонии.
            </p>
            <div className="flex">
              {/* временно: переходы с главной отключены
              <a href="/contact">
                <Button
                  size="md"
                  className="bg-[#E62614] text-white rounded-sm px-8 py-3 hover:bg-[#E62614]/90"
                >
                  Бесплатная консультация
                </Button>
              </a>
              */}
              <Button
                size="md"
                className="bg-[#E62614] text-white rounded-sm px-8 py-3 hover:bg-[#E62614]/90"
              >
                Бесплатная консультация
              </Button>
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
                  <p className="mt-1 text-sm leading-relaxed text-white/85 sm:text-base">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Наши услуги — картинки: public/images/home-services/ (см. массив homeServicesBlock) */}
      <section className="bg-[#fdfbf6] py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:justify-center">
              <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
              <h2 className="shrink-0 text-center text-2xl font-bold text-[#232326] sm:text-3xl lg:text-4xl">
                Наши услуги
              </h2>
              <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
            </div>
            {/* временно: переходы с главной отключены
            <Link
              href="/services"
              className="shrink-0 self-center rounded-md border border-[#232326] bg-white px-5 py-2.5 text-sm font-medium text-[#232326] transition-colors hover:bg-[#232326]/5 lg:self-auto"
            >
              Смотреть все
            </Link>
            */}
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {[
              {
                id: 'diagnostics',
                title: 'Диагностика системы увлажнения',
                image: '/images/home-services/diagnostics.png',
              },
              {
                id: 'installation',
                title: 'Монтаж',
                image: '/images/home-services/installation.png',
              },
              {
                id: 'pnr',
                title: 'ПНР',
                image: '/images/home-services/pnr.png',
              },
              {
                id: 'maintenance',
                title: 'Техническое обслуживание',
                image: '/images/home-services/maintenance.png',
              },
            ].map((service) => (
              <li
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-[#232326]/15 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full bg-[#e8e6e1]">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex min-h-[200px] flex-1 flex-col justify-between gap-6 bg-[#232326] p-6 transition-colors duration-300 group-hover:bg-[#E62614] sm:min-h-[220px]">
                  <h3 className="text-lg font-bold uppercase leading-snug tracking-wide text-white sm:text-xl">
                    {service.title}
                  </h3>
                  <button
                    type="button"
                    className="w-full rounded-md border border-transparent bg-[#E62614] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#E62614]/90 group-hover:border-[#232326] group-hover:bg-white group-hover:text-[#232326] group-hover:hover:bg-[#fdfbf6]"
                  >
                    Заказать услугу
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-12 max-w-3xl sm:mt-14 lg:mt-16">
            <div className="flex items-start gap-4 sm:gap-5">
              <span
                className="mt-1 h-14 w-px shrink-0 bg-[#232326]/20 sm:h-16"
                aria-hidden
              />
              <p className="min-w-0 flex-1 text-left text-base leading-relaxed text-[#232326] sm:text-lg">
                Требуется экспертная помощь по увлажнению? Позвоните или оставьте заявку — мы предложим
                лучшее решение для вашего объекта
              </p>
            </div>
            <div className="mt-8 flex justify-center sm:mt-10">
              {/* временно: переходы с главной отключены
              <a
                href="/contact"
                className="inline-flex w-full max-w-md items-center justify-center rounded-lg bg-[#E62614] px-8 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90 sm:text-lg"
              >
                Связаться с инженером
              </a>
              */}
              <span className="inline-flex w-full max-w-md cursor-default items-center justify-center rounded-lg bg-[#E62614] px-8 py-4 text-center text-base font-semibold text-white sm:text-lg">
                Связаться с инженером
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden">
        <div className="bg-[#fdfbf6] pb-8 pt-12 sm:pb-10 sm:pt-16 lg:pb-12 lg:pt-20">
          <div className={container1100}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex min-w-0 flex-1 items-center gap-4 lg:justify-center">
                <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
                <h2 className="shrink-0 text-center text-2xl font-bold text-[#232326] sm:text-3xl lg:text-4xl">
                  Выбор клиентов
                </h2>
                <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
              </div>
              {/* временно: переходы с главной отключены
              <Link href="/catalog" className="shrink-0 self-center rounded-md border border-[#232326] bg-white px-5 py-2.5 text-sm font-medium text-[#232326] transition-colors hover:bg-[#232326]/5 lg:self-auto">
                Смотреть все
              </Link>
              */}
              <span className="shrink-0 cursor-default self-center rounded-md border border-[#232326] bg-white px-5 py-2.5 text-sm font-medium text-[#232326] lg:self-auto">
                Смотреть все
              </span>
            </div>
          </div>
        </div>

        <div
          className="relative py-12 sm:py-16 lg:py-20"
          style={{
            background:
              'radial-gradient(ellipse 130% 90% at 50% -20%, #3a383c 0%, #2a282b 35%, #232326 60%, #18181a 100%)',
          }}
        >
          <div className={container1100}>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {customerChoiceProducts.map((product) => (
                <li key={product.id}>
                  <article className="group flex cursor-pointer flex-col overflow-hidden rounded-lg shadow-lg shadow-black/25 transition-shadow hover:shadow-xl hover:shadow-black/30">
                    <div className="flex min-h-[220px] items-center justify-center bg-white px-6 py-10 sm:min-h-[260px] sm:px-8 sm:py-12">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={280}
                        height={280}
                        className="h-auto max-h-[220px] w-full max-w-[240px] object-contain sm:max-h-[260px] sm:max-w-[280px]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center bg-[#e8e6e1] px-5 py-8 text-center transition-colors duration-300 group-hover:bg-[#E62614] sm:px-6 sm:py-10">
                      <h3 className="text-lg font-bold text-[#232326] transition-colors duration-300 group-hover:text-white sm:text-xl">
                        {product.title}
                      </h3>
                      <p className="mt-2 max-w-[18rem] text-sm leading-snug text-[#232326]/85 transition-colors duration-300 group-hover:text-white/95 sm:text-base">
                        {product.subtitle}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#fdfbf6] py-12 sm:py-16 lg:py-20">
        <div className={container1100}>
          <div className="mb-10 flex items-center gap-4 sm:mb-12 lg:mb-14">
            <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
            <h2 className="shrink-0 text-center text-2xl font-bold text-[#232326] sm:text-3xl lg:text-4xl">
              Комплектующие и запчасти
            </h2>
            <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
          </div>

          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {partsAccessoriesCategories.map((item) => (
              <li key={item.id}>
                <article className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border border-[#232326]/10 bg-[#e8e6e1] shadow-md transition-shadow duration-300 hover:shadow-xl">
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
                  <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-lg font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xl">
                    {item.title}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RealizedProjectsSlider projects={realizedProjects} containerClassName={container1100} />

    </div>
  )
}

