// src/lib/validation.ts

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateAssignment(body: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
    errors.push({ field: "title", message: "title is required and must be a non-empty string" });
  }
  if (!body.subject || typeof body.subject !== "string" || body.subject.trim() === "") {
    errors.push({ field: "subject", message: "subject is required and must be a non-empty string" });
  }
  if (!body.dueDate || typeof body.dueDate !== "string") {
    errors.push({ field: "dueDate", message: "dueDate is required (format: YYYY-MM-DD)" });
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)) {
    errors.push({ field: "dueDate", message: "dueDate must be in YYYY-MM-DD format" });
  }
  if (!body.status) {
    errors.push({ field: "status", message: "status is required" });
  } else if (!["pending", "in-progress", "completed", "overdue"].includes(body.status as string)) {
    errors.push({ field: "status", message: "status must be one of: pending, in-progress, completed, overdue" });
  }
  if (!body.priority) {
    errors.push({ field: "priority", message: "priority is required" });
  } else if (!["low", "medium", "high"].includes(body.priority as string)) {
    errors.push({ field: "priority", message: "priority must be one of: low, medium, high" });
  }

  return errors;
}

export function validateUpdateAssignment(body: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim() === "")) {
    errors.push({ field: "title", message: "title must be a non-empty string" });
  }
  if (body.subject !== undefined && (typeof body.subject !== "string" || body.subject.trim() === "")) {
    errors.push({ field: "subject", message: "subject must be a non-empty string" });
  }
  if (body.dueDate !== undefined) {
    if (typeof body.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)) {
      errors.push({ field: "dueDate", message: "dueDate must be in YYYY-MM-DD format" });
    }
  }
  if (body.status !== undefined && !["pending", "in-progress", "completed", "overdue"].includes(body.status as string)) {
    errors.push({ field: "status", message: "status must be one of: pending, in-progress, completed, overdue" });
  }
  if (body.priority !== undefined && !["low", "medium", "high"].includes(body.priority as string)) {
    errors.push({ field: "priority", message: "priority must be one of: low, medium, high" });
  }

  return errors;
}