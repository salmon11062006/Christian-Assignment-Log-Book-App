import { NextResponse } from "next/server";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "YourName Assignment Log Book API",
    version: "1.0.0",
    description:
      "A RESTful API for managing student assignment records. Supports full CRUD operations with filtering, validation, and standardized responses.",
    contact: {
      name: "YourName",
      email: "yourname@example.com",
    },
  },
  servers: [
    {
      url: "/",
      description: "Local Development Server",
    },
  ],
  tags: [
    {
      name: "Assignments",
      description: "Endpoints for managing assignments",
    },
  ],
  paths: {
    "/api/assignments": {
      get: {
        summary: "Get all assignments",
        description:
          "Returns all assignments. Can optionally be filtered by `status` or `priority` query parameters.",
        tags: ["Assignments"],
        parameters: [
          {
            in: "query",
            name: "status",
            schema: { type: "string", enum: ["pending", "in-progress", "completed", "overdue"] },
            description: "Filter assignments by status",
          },
          {
            in: "query",
            name: "priority",
            schema: { type: "string", enum: ["low", "medium", "high"] },
            description: "Filter assignments by priority",
          },
        ],
        responses: {
          "200": {
            description: "List of assignments",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AssignmentListResponse" },
                example: {
                  success: true,
                  message: "Retrieved 2 assignment(s) successfully",
                  data: {
                    assignments: [
                      {
                        id: "asgn-001",
                        title: "Implement REST API",
                        description: "Build a CRUD API using Next.js",
                        subject: "Web Development",
                        dueDate: "2025-04-01",
                        status: "in-progress",
                        priority: "high",
                        createdAt: "2025-03-01T00:00:00.000Z",
                        updatedAt: "2025-03-10T00:00:00.000Z",
                      },
                    ],
                    total: 1,
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid query parameter",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  message: "Invalid status filter. Must be one of: pending, in-progress, completed, overdue",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new assignment",
        description: "Creates a new assignment and stores it.",
        tags: ["Assignments"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAssignmentDto" },
              example: {
                title: "Build REST API",
                description: "Implement CRUD endpoints using Next.js",
                subject: "Web Development",
                dueDate: "2025-04-15",
                status: "pending",
                priority: "high",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Assignment created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AssignmentResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  message: "Validation failed",
                  errors: [
                    { field: "title", message: "title is required and must be a non-empty string" },
                    { field: "dueDate", message: "dueDate is required (format: YYYY-MM-DD)" },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/assignments/{id}": {
      get: {
        summary: "Get a single assignment",
        description: "Retrieves a single assignment by its ID.",
        tags: ["Assignments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Assignment ID",
            example: "asgn-001",
          },
        ],
        responses: {
          "200": {
            description: "Assignment found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AssignmentResponse" } } },
          },
          "404": {
            description: "Assignment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { success: false, message: "Assignment with id 'asgn-999' not found" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update an assignment",
        description: "Updates one or more fields of an assignment. All fields are optional.",
        tags: ["Assignments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Assignment ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAssignmentDto" },
              example: { status: "completed", priority: "low" },
            },
          },
        },
        responses: {
          "200": {
            description: "Assignment updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AssignmentResponse" } } },
          },
          "400": {
            description: "Validation failed or empty body",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          "404": {
            description: "Assignment not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
      delete: {
        summary: "Delete an assignment",
        description: "Permanently deletes an assignment by ID.",
        tags: ["Assignments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "Assignment ID",
          },
        ],
        responses: {
          "200": {
            description: "Assignment deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: { success: true, message: "Assignment deleted successfully", data: { id: "asgn-001" } },
              },
            },
          },
          "404": {
            description: "Assignment not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Assignment: {
        type: "object",
        properties: {
          id: { type: "string", example: "asgn-001" },
          title: { type: "string", example: "Implement REST API" },
          description: { type: "string", example: "Build CRUD endpoints" },
          subject: { type: "string", example: "Web Development" },
          dueDate: { type: "string", format: "date", example: "2025-04-01" },
          status: { type: "string", enum: ["pending", "in-progress", "completed", "overdue"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateAssignmentDto: {
        type: "object",
        required: ["title", "subject", "dueDate", "status", "priority"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          subject: { type: "string" },
          dueDate: { type: "string", format: "date", example: "2025-04-15" },
          status: { type: "string", enum: ["pending", "in-progress", "completed", "overdue"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
        },
      },
      UpdateAssignmentDto: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          subject: { type: "string" },
          dueDate: { type: "string", format: "date" },
          status: { type: "string", enum: ["pending", "in-progress", "completed", "overdue"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
        },
      },
      AssignmentResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/Assignment" },
        },
      },
      AssignmentListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              assignments: { type: "array", items: { $ref: "#/components/schemas/Assignment" } },
              total: { type: "integer" },
            },
          },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(swaggerSpec);
}