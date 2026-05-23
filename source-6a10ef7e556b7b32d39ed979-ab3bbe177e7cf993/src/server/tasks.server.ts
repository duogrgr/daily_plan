import { db } from "../../db/index.js";
import { tasks } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

export async function getTasksForDate(date: string) {
  return db.select().from(tasks).where(eq(tasks.date, date));
}

export async function createTask(title: string, date: string, priority: string) {
  const [task] = await db
    .insert(tasks)
    .values({ title, date, priority })
    .returning();
  return task;
}

export async function toggleTaskById(id: number) {
  const [existing] = await db.select().from(tasks).where(eq(tasks.id, id));
  if (!existing) throw new Error("Task not found");
  const [updated] = await db
    .update(tasks)
    .set({ completed: !existing.completed })
    .where(eq(tasks.id, id))
    .returning();
  return updated;
}

export async function updateTaskTitle(id: number, title: string) {
  const [updated] = await db
    .update(tasks)
    .set({ title })
    .where(eq(tasks.id, id))
    .returning();
  return updated;
}

export async function deleteTaskById(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
}
