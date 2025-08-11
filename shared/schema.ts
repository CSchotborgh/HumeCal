import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, jsonb, timestamp, index, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  eventType: text("event_type").notNull(), // "Summer Camp", "Women's Retreat", "Men's Retreat", etc.
  description: text("description"),
  ageGroup: text("age_group").notNull(), // "8-11", "18+", "16-17", etc.
  gender: text("gender"), // "Male", "Female", "Coed", null
  location: text("location").default("Hume Lake, CA"),
  speaker: text("speaker"), // Featured speaker name
  specialNotes: text("special_notes"), // "FILLING FAST", "50% OFF", etc.
  pricingOptions: jsonb("pricing_options").notNull().$type<PricingOption[]>(),
});

export type PricingOption = {
  name: string;
  price: number;
  description?: string;
};

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication and favorites
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  calendarSyncEnabled: boolean("calendar_sync_enabled").default(false),
  googleCalendarId: varchar("google_calendar_id"),
  outlookCalendarId: varchar("outlook_calendar_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorite events table
export const favoriteEvents = pgTable("favorite_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: varchar("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow(),
  syncedToCalendar: boolean("synced_to_calendar").default(false),
  externalCalendarEventId: varchar("external_calendar_event_id"),
});

// Calendar sync log for tracking sync operations
export const calendarSyncLog = pgTable("calendar_sync_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: varchar("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  operation: varchar("operation").notNull(), // "create", "update", "delete"
  calendarProvider: varchar("calendar_provider").notNull(), // "google", "outlook"
  status: varchar("status").notNull(), // "success", "failed", "pending"
  externalEventId: varchar("external_event_id"),
  errorMessage: text("error_message"),
  syncedAt: timestamp("synced_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  favoriteEvents: many(favoriteEvents),
  calendarSyncLogs: many(calendarSyncLog),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  favoriteEvents: many(favoriteEvents),
  calendarSyncLogs: many(calendarSyncLog),
}));

export const favoriteEventsRelations = relations(favoriteEvents, ({ one }) => ({
  user: one(users, {
    fields: [favoriteEvents.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [favoriteEvents.eventId],
    references: [events.id],
  }),
}));

export const calendarSyncLogRelations = relations(calendarSyncLog, ({ one }) => ({
  user: one(users, {
    fields: [calendarSyncLog.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [calendarSyncLog.eventId],
    references: [events.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertFavoriteEvent = typeof favoriteEvents.$inferInsert;
export type FavoriteEvent = typeof favoriteEvents.$inferSelect;

export type InsertCalendarSyncLog = typeof calendarSyncLog.$inferInsert;
export type CalendarSyncLog = typeof calendarSyncLog.$inferSelect;
