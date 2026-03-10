export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;       // ISO date string
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export type CreateAssignmentDto = Omit<Assignment, "id" | "createdAt" | "updatedAt">;
export type UpdateAssignmentDto = Partial<CreateAssignmentDto>;

// Seed data
const store: Assignment[] = [
  {
    id: "asgn-001",
    title: "Implement REST API with Next.js",
    description: "Build a full CRUD REST API for the assignment logbook using Next.js App Router.",
    subject: "Web Development",
    dueDate: "2025-04-01",
    status: "in-progress",
    priority: "high",
    createdAt: new Date("2025-03-01").toISOString(),
    updatedAt: new Date("2025-03-10").toISOString(),
  },
  {
    id: "asgn-002",
    title: "Database Design and Normalization",
    description: "Design and normalize a relational database schema for an e-commerce system.",
    subject: "Database Systems",
    dueDate: "2025-03-25",
    status: "pending",
    priority: "medium",
    createdAt: new Date("2025-03-02").toISOString(),
    updatedAt: new Date("2025-03-02").toISOString(),
  },
  {
    id: "asgn-003",
    title: "Binary Search Tree Implementation",
    description: "Implement a BST in Python with insert, delete, and traversal operations.",
    subject: "Data Structures & Algorithms",
    dueDate: "2025-03-15",
    status: "completed",
    priority: "high",
    createdAt: new Date("2025-02-28").toISOString(),
    updatedAt: new Date("2025-03-14").toISOString(),
  },
];

export const db = {
  getAll(): Assignment[] {
    return [...store];
  },

  getById(id: string): Assignment | undefined {
    return store.find((a) => a.id === id);
  },

  create(data: CreateAssignmentDto): Assignment {
    const now = new Date().toISOString();
    const assignment: Assignment = {
      ...data,
      id: `asgn-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    store.push(assignment);
    return assignment;
  },

  update(id: string, data: UpdateAssignmentDto): Assignment | null {
    const idx = store.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    store[idx] = {
      ...store[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return store[idx];
  },

  delete(id: string): boolean {
    const idx = store.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    store.splice(idx, 1);
    return true;
  },
};