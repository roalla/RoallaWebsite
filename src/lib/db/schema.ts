import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().default(''),
  name: text('name').notNull().default(''),
  role: text('role').notNull().default('contractor'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  stage: text('stage').notNull().default('lead'),
  journeyPillar: text('journey_pillar'),
  serviceLine: text('service_line').notNull().default('digital'),
  primaryContact: text('primary_contact').notNull().default(''),
  primaryEmail: text('primary_email').notNull().default(''),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'set null' }),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const customerActivities = pgTable('customer_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  activityType: text('activity_type').notNull().default('note'),
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const engagements = pgTable('engagements', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  serviceLine: text('service_line').notNull().default('digital'),
  status: text('status').notNull().default('active'),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'set null' }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ChecklistItem = {
  id: string
  label: string
  done: boolean
}

export const playbookRuns = pgTable('playbook_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id').references(() => engagements.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull(),
  title: text('title').notNull(),
  checklist: jsonb('checklist').$type<ChecklistItem[]>().notNull().default([]),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const customerAssignments = pgTable(
  'customer_assignments',
  {
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.customerId, t.userId] })],
)
