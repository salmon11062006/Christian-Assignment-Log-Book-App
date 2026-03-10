# 📚 Christian - Assignment Log Book API

A RESTful API built with **Next.js 14 App Router** for managing student assignment records. Features full CRUD operations, query filtering, input validation, standardized responses, and Swagger/OpenAPI documentation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, pnpm or yarn

## 📐 API Design Table

| # | Method | Endpoint | Description | Request Body | Success Response | Error Response |
|---|--------|----------|-------------|--------------|-----------------|----------------|
| 1 | `GET` | `/api/assignments` | Get all assignments | — | `200` List of assignments | `400` Invalid filter |
| 2 | `GET` | `/api/assignments?status={status}` | Filter by status | — | `200` Filtered list | `400` Invalid status |
| 3 | `GET` | `/api/assignments?priority={priority}` | Filter by priority | — | `200` Filtered list | `400` Invalid priority |
| 4 | `POST` | `/api/assignments` | Create a new assignment | `CreateAssignmentDto` | `201` Created assignment | `400` Validation errors |
| 5 | `GET` | `/api/assignments/:id` | Get single assignment | — | `200` Assignment object | `404` Not found |
| 6 | `PUT` | `/api/assignments/:id` | Update an assignment | `UpdateAssignmentDto` (partial) | `200` Updated assignment | `400` Validation / `404` Not found |
| 7 | `DELETE` | `/api/assignments/:id` | Delete an assignment | — | `200` Deleted ID | `404` Not found |
| 8 | `GET` | `/api/docs` | Get OpenAPI JSON spec | — | `200` Swagger JSON | — |

---

## 📦 Data Model

### Assignment Object

```json
{
  "id": "asgn-1710000000000",
  "title": "Implement REST API with Next.js",
  "description": "Build a full CRUD REST API for the assignment logbook.",
  "subject": "Web Development",
  "dueDate": "2025-04-01",
  "status": "in-progress",
  "priority": "high",
  "createdAt": "2025-03-01T00:00:00.000Z",
  "updatedAt": "2025-03-10T00:00:00.000Z"
}
```

### Field Definitions

| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| `id` | string | auto | Auto-generated |
| `title` | string | ✅ | Any non-empty string |
| `description` | string | ❌ | Any string |
| `subject` | string | ✅ | Any non-empty string |
| `dueDate` | string | ✅ | `YYYY-MM-DD` format |
| `status` | string | ✅ | `pending` \| `in-progress` \| `completed` \| `overdue` |
| `priority` | string | ✅ | `low` \| `medium` \| `high` |
| `createdAt` | string | auto | ISO 8601 datetime |
| `updatedAt` | string | auto | ISO 8601 datetime |

---

## 🔁 Standard Response Format

### ✅ Success

```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": { ... }
}
```

### ❌ Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "title is required and must be a non-empty string" }
  ]
}
```

---

## 📖 API Documentation

Swagger UI is available at: **`http://localhost:3000/api-docs`**

The raw OpenAPI 3.0 spec is served at: **`/api/docs`**

---

## 🏗️ Project Structure

```
app/
├── api/
│   ├── assignments/
│   │   ├── route.ts          # GET all, POST
│   │   └── [id]/
│   │       └── route.ts      # GET, PUT, DELETE by ID
│   └── docs/
│       └── route.ts          # OpenAPI spec
├── api-docs/
└── page.tsx              # Swagger UI page
├── layout.tsx
└── page.tsx                  # Home page
lib/
├── store.ts                  # In-memory data store
├── validation.ts             # Input validators
└── response.ts               # Response helpers
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Framework (App Router) |
| TypeScript | Type safety |
| swagger-ui-react | API documentation UI |
| In-memory store | Data persistence (dev) |

---