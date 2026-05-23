import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial().primaryKey(),
  title: text().notNull(),
  completed: boolean().notNull().default(false),
  date: text("date").notNull(),
  priority: text().notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});
