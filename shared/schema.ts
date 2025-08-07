import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, jsonb } from "drizzle-orm/pg-core";
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

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
