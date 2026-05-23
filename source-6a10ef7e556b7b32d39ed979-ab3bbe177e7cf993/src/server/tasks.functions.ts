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
  .handler(async ({ data }) => {
    try {
      return await getTasksForDate(data.date);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  });

export const addTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ title: z.string().min(1), date: z.string(), priority: z.string() }))
  .handler(async ({ data }) => {
    try {
      return await createTask(data.title, data.date, data.priority);
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  });

export const toggleTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    try {
      return await toggleTaskById(data.id);
    } catch (error) {
      console.error("Error toggling task:", error);
      throw new Error("Failed to toggle task");
    }
  });

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number(), title: z.string().min(1) }))
  .handler(async ({ data }) => {
    try {
      return await updateTaskTitle(data.id, data.title);
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  });

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    try {
      return await deleteTaskById(data.id);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  });
