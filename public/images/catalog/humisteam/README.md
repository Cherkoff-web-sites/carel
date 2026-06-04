# humiSteam — куда класть картинки

Корень на диске:

```
prod/public/images/catalog/humisteam/
```

В браузере пути начинаются с `/images/catalog/humisteam/…`

Формат: **PNG** или **JPG/WebP** (если меняете расширение — поправьте имена в `lib/humisteamData.ts`).

---

## 1. Слайдер (4 фото)

Папка: `prod/public/images/catalog/humisteam/`

| Имя файла на диске | URL на сайте | Что это |
|--------------------|--------------|---------|
| `gallery-1.png` | `/images/catalog/humisteam/gallery-1.png` | Слайд 1 (главное фото линейки) |
| `gallery-2.png` | `/images/catalog/humisteam/gallery-2.png` | Слайд 2 |
| `gallery-3.png` | `/images/catalog/humisteam/gallery-3.png` | Слайд 3 |
| `gallery-4.png` | `/images/catalog/humisteam/gallery-4.png` | Слайд 4 |

Рекомендуемый размер: ~1200×900 px и выше, объект по центру, фон прозрачный или светлый.

---

## 2. Карточки моделей в списке

Папка: `prod/public/images/catalog/humisteam/products/`

**Сейчас на все товары одно фото:**

| Имя файла | URL на сайте |
|-----------|--------------|
| `ue001yd001.png` | `/images/catalog/humisteam/products/ue001yd001.png` |

Позже можно добавить отдельные файлы по артикулу (см. таблицу ниже).

| Артикул (SKU) | Имя файла | URL на сайте | Название в каталоге |
|---------------|-----------|--------------|---------------------|
| UE001YD001 | `ue001yd001.png` | `/images/catalog/humisteam/products/ue001yd001.png` | UE001YD001 — humiSteam Basic 1,5 кг/ч |
| UE003YE001 | `ue003ye001.png` | `/images/catalog/humisteam/products/ue003ye001.png` | UE003YE001 — humiSteam Basic 5 кг/ч (разборный) |
| UE005YD001 | `ue005yd001.png` | `/images/catalog/humisteam/products/ue005yd001.png` | UE005YD001 — humiSteam Basic 8 кг/ч |
| UE010YD001 | `ue010yd001.png` | `/images/catalog/humisteam/products/ue010yd001.png` | UE010YD001 — humiSteam Basic 15 кг/ч |
| UE015YD001 | `ue015yd001.png` | `/images/catalog/humisteam/products/ue015yd001.png` | UE015YD001 — humiSteam Basic 25 кг/ч |
| UE003XD001 | `ue003xd001.png` | `/images/catalog/humisteam/products/ue003xd001.png` | UE003XD001 — humiSteam X-Plus 3 кг/ч |
| UE005XD001 | `ue005xd001.png` | `/images/catalog/humisteam/products/ue005xd001.png` | UE005XD001 — humiSteam X-Plus 5 кг/ч |
| UE010XD001 | `ue010xd001.png` | `/images/catalog/humisteam/products/ue010xd001.png` | UE010XD001 — humiSteam X-Plus 10 кг/ч |
| UE018XD001 | `ue018xd001.png` | `/images/catalog/humisteam/products/ue018xd001.png` | UE018XD001 — humiSteam X-Plus 18 кг/ч |
| UE035XD001 | `ue035xd001.png` | `/images/catalog/humisteam/products/ue035xd001.png` | UE035XD001 — humiSteam X-Plus 35 кг/ч |
| UE001WD001 | `ue001wd001.png` | `/images/catalog/humisteam/products/ue001wd001.png` | UE001WD001 — humiSteam Wellness 1,5 кг/ч |
| UE005WD001 | `ue005wd001.png` | `/images/catalog/humisteam/products/ue005wd001.png` | UE005WD001 — humiSteam Wellness 5 кг/ч |
| UE009WD001 | `ue009wd001.png` | `/images/catalog/humisteam/products/ue009wd001.png` | UE009WD001 — humiSteam Wellness 9 кг/ч |
| UE015WD001 | `ue015wd001.png` | `/images/catalog/humisteam/products/ue015wd001.png` | UE015WD001 — humiSteam Wellness 15 кг/ч |
| UE045WD001 | `ue045wd001.png` | `/images/catalog/humisteam/products/ue045wd001.png` | UE045WD001 — humiSteam Wellness 45 кг/ч |

Рекомендуемый размер карточки: ~400×400 px, устройство на прозрачном/белом фоне.

---

## 3. Линейки (подписи в фильтре, без отдельных картинок)

| ID в коде | Подпись в «Выберите модель» |
|-----------|------------------------------|
| `basic-uey` | Basic (UE*Y) |
| `xplus-uex` | X-Plus (UE*X) |
| `wellness-uew` | Wellness (UE*W) |

---

## 4. Производительность (только цифры в UI, файлов нет)

Значения сетки: **1,5 · 3 · 5 · 8 · 9 · 10 · 15 · 18 · 25 · 35 · 45 · 65 · 90 · 130** кг/ч.

Для новых моделей добавьте строку в `HUMISTEAM_PRODUCTS` в `lib/humisteamData.ts` и положите файл в `products/`.

---

## Структура папок (итог)

```
public/images/catalog/humisteam/
├── gallery-1.png
├── gallery-2.png
├── gallery-3.png
├── gallery-4.png
├── README.md
└── products/
    ├── ue001yd001.png
    ├── ue003ye001.png
    └── … (остальные по таблице)
```
