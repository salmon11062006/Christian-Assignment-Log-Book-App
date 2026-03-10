/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     description: Returns a list of all assignments, optionally filtered by status or priority.
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed, overdue]
 *         description: Filter by assignment status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by assignment priority
 *     responses:
 *       200:
 *         description: A list of assignments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentListResponse'
 *   post:
 *     summary: Create a new assignment
 *     description: Creates and stores a new assignment entry.
 *     tags:
 *       - Assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssignmentDto'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextRequest } from "next/server";
import { db } from "@/lib/store";
import { validateCreateAssignment } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  let assignments = db.getAll();

  if (status) {
    const validStatuses = ["pending", "in-progress", "completed", "overdue"];
    if (!validStatuses.includes(status)) {
      return errorResponse(`Invalid status filter. Must be one of: ${validStatuses.join(", ")}`, 400);
    }
    assignments = assignments.filter((a) => a.status === status);
  }

  if (priority) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(priority)) {
      return errorResponse(`Invalid priority filter. Must be one of: ${validPriorities.join(", ")}`, 400);
    }
    assignments = assignments.filter((a) => a.priority === priority);
  }

  return successResponse(
    { assignments, total: assignments.length },
    `Retrieved ${assignments.length} assignment(s) successfully`
  );
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const errors = validateCreateAssignment(body);
  if (errors.length > 0) {
    return errorResponse("Validation failed", 400, errors);
  }

  const assignment = db.create({
    title: (body.title as string).trim(),
    description: typeof body.description === "string" ? body.description.trim() : "",
    subject: (body.subject as string).trim(),
    dueDate: body.dueDate as string,
    status: body.status as "pending" | "in-progress" | "completed" | "overdue",
    priority: body.priority as "low" | "medium" | "high",
  });

  return successResponse(assignment, "Assignment created successfully", 201);
}