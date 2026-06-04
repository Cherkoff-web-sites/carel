import type { SectionSubNavItem } from '@/components/Layout/SectionSubNav'

/** Общая поднавигация над контентом на страницах «Услуги» и «Каталог» */
export const SECTION_SUB_NAV: readonly SectionSubNavItem[] = [
  { href: '/', label: 'Главная', matchRule: { type: 'exact' } },
  {
    href: '/services/maintenance',
    label: 'Наши услуги',
    matchRule: { type: 'prefix', prefix: '/services' },
  },
  {
    href: '/catalog',
    label: 'Каталог',
    matchRule: { type: 'prefix', prefix: '/catalog' },
  },
  {
    href: '/components',
    label: 'Комплектующие',
    matchRule: { type: 'prefix', prefix: '/components' },
  },
] as const
