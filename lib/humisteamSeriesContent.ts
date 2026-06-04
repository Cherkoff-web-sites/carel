import { HUMISTEAM_MODEL_IDS, type HumisteamModelId } from '@/lib/catalogData'
import { HUMISTEAM_PRODUCT_IMAGE } from '@/lib/humisteamData'

export const HUMISTEAM_SERIES_INTRO = {
  title: 'humiSteam — комплексная линейка паровых увлажнителей для решения задач увлажнения и микроклимата',
  text: 'Серия охватывает объекты от жилых и коммерческих помещений до промышленных площадок и wellness-зон. В каталоге представлены все линейки humiSteam: Basic (UE*Y), X-Plus (UE*X) и Wellness (UE*W) — производительность от 1 до 130 кг/ч пара. Ниже — кратко о каждой линейке; конкретную модель и мощность можно выбрать в карточке товара или в списке каталога.',
} as const

type SeriesLineContent = {
  heading: string
  text: string
  image: string
  imageAlt: string
}

const SERIES_LINE_CONTENT: Record<HumisteamModelId, SeriesLineContent> = {
  'basic-uey': {
    heading: 'Basic (UE*Y) — Базовое решение для стандартных задач',
    text: 'Простое и надёжное управление, производительность от 1 до 65 кг/ч. Модели комплектуются электронным контроллером серии Y с алфавитно-цифровым дисплеем. Подходит для офисов, торговых центров, производственных и жилых помещений с типовыми требованиями к увлажнению и микроклимату.',
    image: HUMISTEAM_PRODUCT_IMAGE,
    imageAlt: 'humiSteam Basic',
  },
  'xplus-uex': {
    heading: 'X-Plus (UE*X) — Профессиональное решение с расширенным функционалом',
    text: 'Премиальная линейка увлажнителей с передовыми технологиями управления и автоматизации. Модели производительностью 1,5–130 кг/ч комплектуются встроенным интеллектуальным контроллером типа X серии pCO, графическим жидкокристаллическим дисплеем и удобной кнопочной клавиатурой для программирования и контроля всех параметров. Система автоматически адаптируется к качеству воды, оптимизирует энергопотребление, поддерживает встроенный протокол Modbus и другие промышленные стандарты связи. Встроенная система антивспенивания (AFS) гарантирует подачу чистого пара без капель. Подходит для крупных офисных центров, торговых комплексов, медицинских учреждений, производственных объектов с требованиями к точному климат-контролю.',
    image: HUMISTEAM_PRODUCT_IMAGE,
    imageAlt: 'humiSteam X-Plus',
  },
  'wellness-uew': {
    heading: 'Wellness (UE*W) — Специализированное решение для саун и банных комплексов',
    text: 'Линейка для wellness-зон, саун и бань с технологиями точного увлажнения и безопасной работы в агрессивной среде. Модели оснащаются погружными электродами, адаптированы к режимам высокой температуры и влажности, обеспечивают стабильную подачу пара без пересушивания воздуха. Подходят для спа-центров, фитнес-клубов, частных бань и коммерческих wellness-объектов, где важны комфорт, гигиена и долговечность оборудования.',
    image: HUMISTEAM_PRODUCT_IMAGE,
    imageAlt: 'humiSteam Wellness',
  },
}

export function getHumiSteamSeriesLineContent(modelId: HumisteamModelId): SeriesLineContent {
  return SERIES_LINE_CONTENT[modelId]
}

/** Все линейки серии — для вкладки «Описание серии» (единый обзор) */
export function getAllHumiSteamSeriesLines(): SeriesLineContent[] {
  return HUMISTEAM_MODEL_IDS.map((id) => SERIES_LINE_CONTENT[id])
}
