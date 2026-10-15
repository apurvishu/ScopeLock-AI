export default function About() {
  const STACK = [
    { label: "Frontend",  value: "React 19 + Vite 8" },
    { label: "Language",  value: "TypeScript" },
    { label: "Backend",   value: "Node.js + Express" },
    { label: "Database",  value: "SQLite (better-sqlite3)" },
    { label: "Charts",    value: "Recharts" },
    { label: "Icons/UI",  value: "Lucide React" },
    { label: "Auth",      value: "Deterministic policy engine" },
    { label: "Audit",     value: "SQLite persisted events" },
    { label: "Hackathon", value: "MLH — Best Open Source AI" },
  ];

  const FEATURES = [
    { icon: "⬡", title: "Authorization Firewall",    desc: "Every AI-proposed action passes through a centralized, deterministic policy engine before execution. The AI never determines final permissions." },
    { icon: "≡", title: "Immutable Audit Trail",     desc: "All authorization decisions — allowed or denied — are persisted to SQLite. The audit log cannot be altered by the AI or the frontend." },
    { icon: "◎", title: "AI-Assisted Exploration",   desc: "A natural-language assistant translates requests into structured actions, which are then validated and authorized server-side before execution." },
    { icon: "⊡", title: "Live Security Dashboard",   desc: "Real-time metrics derived from actual backend events. No fabricated data. Zero-values are shown when no events exist." },
    { icon: "⚡", title: "Role-Based Access Control", desc: "Employees, Managers, and Admins have distinct permissions enforced exclusively on the backend. Client-supplied role claims are never trusted." },
    { icon: "◉", title: "Demo-Safe Architecture",     desc: "Synthetic employee records are used for demonstration. The security enforcement mechanisms are real and reflect production patterns." },
  ];

  return (
    <div>
      <div className="about-hero card">
        <span className="ai">🔐</span>
        <h1>ScopeLock AI</h1>
        <p>
          A trustworthy, verifiable authorization firewall for AI agents.
          Every action proposed by AI is independently validated, authorized,
          and audited by a deterministic backend engine.
        </p>
      </div>

      <div className="feat-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="card feat">
            <span className="feat-i" style={{ color: "var(--accent)" }}>{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Authorization flow */}
      <div className="card card-p" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-1)" }}>
          Authorization Flow
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap",
          fontSize: 11.5, fontFamily: "var(--mono)",
        }}>
          {["User Request", "AI Proposal", "Schema Validation", "Tool Registry", "Identity Resolution", "Policy Engine", "Protected Operation", "Audit Log"].map((s, i, arr) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <div style={{
                background: "var(--bg-raised)", border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)", padding: "5px 10px",
                color: "var(--text-2)", whiteSpace: "nowrap",
              }}>{s}</div>
              {i < arr.length - 1 && (
                <span style={{ color: "var(--text-3)", padding: "0 4px", fontSize: 10 }}>→</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 10 }}>
          The AI only proposes. The policy engine decides. The audit log records.
        </div>
      </div>

      {/* Demo identities */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ padding: "12px 16px 0", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 10 }}>
          Demo Identities — Synthetic Data Only
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Role</th><th>Department</th></tr>
            </thead>
            <tbody>
              {[
                { id: "alice", name: "Alice",   role: "EMPLOYEE", dept: "Engineering" },
                { id: "bob",   name: "Bob",     role: "EMPLOYEE", dept: "Engineering" },
                { id: "carol", name: "Carol",   role: "MANAGER",  dept: "Engineering" },
                { id: "david", name: "David",   role: "EMPLOYEE", dept: "Finance" },
                { id: "admin", name: "Admin",   role: "ADMIN",    dept: "Operations" },
              ].map(u => (
                <tr key={u.id}>
                  <td className="mono" style={{ color: "var(--accent)" }}>{u.id}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-1)" }}>{u.name}</td>
                  <td>
                    <span className={`badge ${u.role === "ADMIN" ? "badge-deny" : u.role === "MANAGER" ? "badge-warn" : "badge-info"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-3)" }}>{u.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-3)", borderTop: "1px solid var(--border-soft)" }}>
          ⚠ These are synthetic records for demonstration only. All salary and personal data is fictional.
        </div>
      </div>

      {/* Tech stack */}
      <div className="card card-p">
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 12 }}>
          Technology Stack
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {STACK.map(s => (
            <div key={s.label} style={{
              background: "var(--bg-raised)", border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)", padding: "10px 12px",
            }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-3)", marginBottom: 3 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
