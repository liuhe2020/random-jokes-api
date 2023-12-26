import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const joke = pgTable('joke', {
  id: serial('id').primaryKey(),
  type: text('type'),
  setup: text('setup').unique(),
  punchline: text('punchline'),
});
