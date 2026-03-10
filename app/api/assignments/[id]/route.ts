// src/app/api/assignments/[id]/route.ts

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get a single assignment by ID
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentResponse'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update an assignment by ID
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAssignmentDto'
 *     responses:
 *       200:
 *         description: Assignment updated
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
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete an assignment by ID
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextRequest } from "next/server";
import { db } from "@/lib/store";
import { validateUpdateAssignment } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/response";

type RouteContext = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const assignment = db.getById(params.id);
  if (!assignment) {
    return errorResponse(`Assignment with id '${params.id}' not found`, 404);
  }
  return successResponse(assignment, "Assignment retrieved successfully");
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const existing = db.getById(params.id);
  if (!existing) {
    return errorResponse(`Assignment with id '${params.id}' not found`, 404);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (Object.keys(body).length === 0) {
    return errorResponse("Request body must contain at least one field to update", 400);
  }

  const errors = validateUpdateAssignment(body);
  if (errors.length > 0) {
    return errorResponse("Validation failed", 400, errors);
  }

  const updated = db.update(params.id, {
    ...(body.title !== undefined && { title: (body.title as string).trim() }),
    ...(body.description !== undefined && { description: (body.description as string).trim() }),
    ...(body.subject !== undefined && { subject: (body.subject as string).trim() }),
    ...(body.dueDate !== undefined && { dueDate: body.dueDate as string }),
    ...(body.status !== undefined && { status: body.status as "pending" | "in-progress" | "completed" | "overdue" }),
    ...(body.priority !== undefined && { priority: body.priority as "low" | "medium" | "high" }),
  });

  return successResponse(updated, "Assignment updated successfully");
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const existing = db.getById(params.id);
  if (!existing) {
    return errorResponse(`Assignment with id '${params.id}' not found`, 404);
  }

  db.delete(params.id);
  return successResponse({ id: params.id }, "Assignment deleted successfully");
}