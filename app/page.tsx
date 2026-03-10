"use client";
// src/app/page.tsx
import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
}

const empty = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
  status: "pending" as const,
  priority: "medium" as const,
};

const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  border: "1px solid #ccc",
  fontSize: 13,
  fontFamily: "monospace",
  width: "100%",
  boxSizing: "border-box",
};

const cell: React.CSSProperties = { padding: "8px 10px", verticalAlign: "middle" };

const statusColors: Record<string, string> = {
  pending: "#b45309",
  "in-progress": "#1d4ed8",
  completed: "#15803d",
  overdue: "#b91c1c",
  low: "#6b7280",
  medium: "#b45309",
  high: "#b91c1c",
};

function Badge({ val }: { val: string }) {
  return (
    <span style={{
      background: statusColors[val] + "18",
      color: statusColors[val],
      padding: "2px 8px",
      fontSize: 12,
      fontWeight: 600,
      border: `1px solid ${statusColors[val]}44`,
    }}>
      {val}
    </span>
  );
}

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchAll() {
    const res = await fetch("/api/assignments");
    const json = await res.json();
    setAssignments(json.data.assignments);
  }

  useEffect(() => { fetchAll(); }, []);

  function startEdit(a: Assignment) {
    setEditingId(a.id);
    setForm({ title: a.title, description: a.description, subject: a.subject, dueDate: a.dueDate, status: a.status, priority: a.priority });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setError("");
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const url = editingId ? `/api/assignments/${editingId}` : "/api/assignments";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) {
        const msg = json.errors ? json.errors.map((e: { field: string; message: string }) => e.message).join(", ") : json.message;
        setError(msg);
      } else {
        setForm(empty);
        setEditingId(null);
        fetchAll();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this assignment?")) return;
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    fetchAll();
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
      {node}
    </div>
  );

  const inp = (key: keyof typeof form, placeholder = "") => (
    <input
      placeholder={placeholder}
      value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={inputStyle}
    />
  );

  const sel = (key: keyof typeof form, options: string[]) => (
    <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px", fontFamily: "monospace", fontSize: 14 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, borderBottom: "2px solid #000", paddingBottom: 10 }}>
        Assignment Log Book
      </h1>

      {/* Form */}
      <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
          {editingId ? `Editing: ${form.title || "…"}` : "New Assignment"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {field("Title *", inp("title", "Assignment title"))}
          {field("Subject *", inp("subject", "e.g. Web Development"))}
          {field("Due Date *", inp("dueDate", "YYYY-MM-DD"))}
          {field("Description", inp("description", "Optional"))}
          {field("Status *", sel("status", ["pending", "in-progress", "completed", "overdue"]))}
          {field("Priority *", sel("priority", ["low", "medium", "high"]))}
        </div>
        {error && <p style={{ color: "#b91c1c", margin: "10px 0 0", fontSize: 13 }}>⚠ {error}</p>}
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: "#000", color: "#fff", border: "none", padding: "7px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 13 }}
          >
            {loading ? "Saving…" : editingId ? "Update" : "Add Assignment"}
          </button>
          {editingId && (
            <button
              onClick={cancelEdit}
              style={{ background: "#fff", color: "#000", border: "1px solid #ccc", padding: "7px 16px", cursor: "pointer", fontFamily: "monospace", fontSize: 13 }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #000" }}>
              {["Title", "Subject", "Due Date", "Status", "Priority", "Actions"].map(h => (
                <th key={h} style={{ padding: "6px 10px", fontSize: 11, fontWeight: 700, textAlign: "left", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "20px 10px", color: "#999" }}>No assignments yet. Add one above.</td></tr>
            )}
            {assignments.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #eee", background: editingId === a.id ? "#fffbea" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={cell}>{a.title}</td>
                <td style={cell}>{a.subject}</td>
                <td style={cell}>{a.dueDate}</td>
                <td style={cell}><Badge val={a.status} /></td>
                <td style={cell}><Badge val={a.priority} /></td>
                <td style={cell}>
                  <button onClick={() => startEdit(a)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "monospace", color: "#1d4ed8", padding: "2px 6px 2px 0" }}>Edit</button>
                  <button onClick={() => handleDelete(a.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "monospace", color: "#b91c1c", padding: "2px 6px 2px 0" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 24, fontSize: 12, color: "#aaa" }}>
        {assignments.length} assignment{assignments.length !== 1 ? "s" : ""} — <a href="/api-docs" style={{ color: "#aaa" }}>API docs</a>
      </p>
    </div>
  );
}