import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

export const products = pgTable(
  'products',
  {
    catalog: text('catalog').notNull(),
    id: text('id').notNull(),
    dataJson: text('data_json').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.catalog, table.id] }),
  })
)
