# CAREL Professional Service — сайт на Next.js

Сайт сервиса увлажнителей CAREL: каталог оборудования, запчасти, услуги, корзина заявок.

## Маршруты

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/catalog` | Увлажнители (навигация через `?id=` и `?sku=`) |
| `/components` | Запчасти и комплектующие (`?id=`) |
| `/services` | Редирект на `/services/maintenance` |
| `/services/[slug]` | Страницы услуг (SSG) |
| `/cart` | Корзина |
| `#contacts` | Контакты в подвале (якорь) |
| `/admin` | Админ-панель каталога и заявок |

Редиректы: `/contact`, `/about` → `/`; `/catalog/converter`, `/catalog/soft-starter`, `/catalog/motor` → `/catalog`.

## Быстрый старт

```bash
cp .env.example .env.local
# PostgreSQL: docker compose up -d db
npm install
npm run db:init   # миграции + seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Сборка

```bash
npm run build
npm start
```

Для Docker и Timeweb Cloud см. `DEPLOY_TIMEWEB.md` в корне репозитория.

## Структура

```
app/
├── layout.tsx              # Header, Footer, корзина, модалка, чат
├── page.tsx                # Главная
├── catalog/                # Каталог увлажнителей (CSR + query params)
├── components/             # Каталог запчастей
├── services/               # Услуги
├── cart/                   # Корзина
├── admin/                  # Админка
└── api/admin/              # API админки (content, products)

components/
├── Header/, Footer/
├── catalog/                # humiSteam, heaterSteam UI
├── components-catalog/     # Запчасти UI
├── services/
└── ContactModal/, ChatWidget/

lib/
├── catalogData.ts          # Дерево каталога увлажнителей
├── humisteam*.ts           # Данные humiSteam
├── heatersteam*.ts         # Данные heaterSteam
├── componentsCatalog*.ts   # Данные запчастей
├── servicesData.ts         # Услуги
└── constants.ts            # Телефон, отступы шапки и т.д.

public/images/              # Статика (см. README в подпапках catalog/)
```

## Технологии

- Next.js 14 (App Router)
- React 18, TypeScript
- Tailwind CSS

## Данные админки

Runtime-файлы `data/content.json` и `data/products.json` создаются админкой на сервере. Папка `data/` в `.gitignore`. При пересборке Docker-контейнера данные не сохраняются — см. деплой-инструкцию.
