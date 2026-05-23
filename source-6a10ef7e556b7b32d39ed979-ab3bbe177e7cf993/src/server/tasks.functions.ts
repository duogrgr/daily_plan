import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getTasksForDate,
  createTask,
  toggleTaskById,
  updateTaskTitle,
  deleteTaskById,
} from "./tasks.server.js";

export const fetchTasks = createServerFn({ method: "GET" })
  .inputValidator(z.object({ date: z.string() }))
  .handler(({ data }) => getTasksForDate(data.date));

export const addTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ title: z.string().min(1), date: z.string(), priority: z.string() }))
  .handler(({ data }) => createTask(data.title, data.date, data.priority));

export const toggleTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(({ data }) => toggleTaskById(data.id));

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number(), title: z.string().min(1) }))
  .handler(({ data }) => updateTaskTitle(data.id, data.title));

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(({ data }) => deleteTaskById(data.id));
