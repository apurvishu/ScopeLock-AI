import { useState, useRef, useEffect } from "react";
import { api } from "../api";
import { useUser } from "../context/UserContext";

// Map natural language prompts to backend authorization calls
const ACTIONS: Record<string, { action: string; resourceId: (id: string) => string; label: string }> = {
  "read_own_profile":          { action: "read_own_profile",          resourceId: id => `employee_${{"alice":"101","bob":"102","carol":"103","david":"104","admin":"105"}[id]??"101"}`, label: "Read own profile" },
  "read_salary":               { action: "read_salary",               resourceId: id => `employee_${{"alice":"101","bob":"102","carol":"103","david":"104","admin":"105"}[id]??"101"}`, label: "Read own salary" },
  "read_other_salary":         { action: "read_salary",               resourceId: id => id === "alice" ? "employee_102" : "employee_101",                                              label: "Read other's salary" },
  "list_department_employees": { action: "list_department_employees", resourceId: () => "employee_101",                                                                                label: "List dept employees" },
  "update_department":         { action: "update_department",         resourceId: () => "employee_103",                                                                                label: "Update department" },
};

const SUGGESTIONS = [
  { label: "Read my own profile",        key: "read_own_profile" },
  { label: "Check my own salary",        key: "read_salary" },
  { label: "Read another employee's salary", key: "read_other_salary" },
  { label: "List employees in my dept",  key: "list_department_employees" },
];

interface Msg {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: Date;
  decision?: { decision: "ALLOW" | "DENY"; reasonCode: string };
}

function parseIntent(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("other") || t.includes("another") || t.includes("bob") || t.includes("carol"))
    return "read_other_salary";
  if (t.includes("salary") || t.includes("pay") || t.includes("compensation"))
    return "read_salary";
  if (t.includes("profile") || t.includes("own") || t.includes("my record"))
    return "read_own_profile";
  if (t.includes("list") || t.includes("department") || t.includes("dept") || t.includes("team"))
    return "list_department_employees";
  if (t.includes("update") || t.includes("change department"))
    return "update_department";
  return null;
}

export default function AIAssistant() {
  const { user } = useUser();
  const [msgs, setMsgs]     = useState<Msg[]>([]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: text.trim(), ts: new Date() };
    setMsgs(m => [...m, userMsg]);
    setLoading(true);

    try {
      const intent = parseIntent(text);
      if (!intent || !ACTIONS[intent]) {
        setMsgs(m => [...m, {
          id: crypto.randomUUID(), role: "ai",
          text: `I can help you test authorization policies. Try: "read my salary", "read another employee's salary", "list my department", or "read my own profile".`,
          ts: new Date(),
        }]);
        return;
      }

      const act = ACTIONS[intent];

      // Inform user what action will be evaluated
      setMsgs(m => [...m, {
        id: crypto.randomUUID(), role: "ai",
        text: `Evaluating action: \`${act.action}\` for resource \`${act.resourceId(user.id)}\` as principal \`${user.id}\`…`,
        ts: new Date(),
      }]);

      // Call backend authorization gateway
      const r = await api.authorizeAction(act.action, "employee", act.resourceId(user.id), user.id);
      const dec = r.decision;
      const allowed = dec.decision === "ALLOW";

      setMsgs(m => [...m, {
        id: crypto.randomUUID(), role: "ai",
        text: allowed
          ? `✅ Access permitted. The authorization engine granted \`${act.label}\`. This decision is enforced by the backend — not by this AI response.`
          : `🚫 Access denied. The authorization engine blocked \`${act.label}\` for \`${user.id}\`. Reason: \`${dec.reasonCode}\`. This is a real policy enforcement — not a simulated response.`,
        ts: new Date(),
        decision: dec,
      }]);
    } catch (e: any) {
      setMsgs(m => [...m, {
        id: crypto.randomUUID(), role: "ai",
        text: `⚠ Backend error: ${e.message ?? "Could not evaluate authorization"}. Ensure the backend is running on port 4000.`,
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--header-h) - 40px)", gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 2 }}>AI Assistant</h2>
        <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>
          Every request is evaluated by the backend authorization gateway · acting as <strong style={{ color: "var(--accent)" }}>{user.label}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 12, flex: 1, minHeight: 0 }}>
        {/* Chat panel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="chat-msgs">
            {msgs.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", padding: "24px 16px" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 5 }}>
                  Authorization-aware AI Assistant
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, maxWidth: 280 }}>
                  Every action you request is evaluated by the backend policy engine before any operation is performed.
                  This AI never determines final permissions.
                </div>
              </div>
            )}

            {msgs.map(m => (
              <div key={m.id} className={`msg ${m.role === "user" ? "user" : ""}`}>
                <div className={`msg-av ${m.role === "ai" ? "ai" : "user"}`}>
                  {m.role === "ai" ? "⬡" : user.id[0].toUpperCase()}
                </div>
                <div className="msg-body">
                  <div className="msg-text" style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                  {m.decision && (
                    <div style={{ marginTop: 6 }}>
                      <span className={`badge ${m.decision.decision === "ALLOW" ? "badge-allow" : "badge-deny"}`}>
                        {m.decision.decision}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-3)", marginLeft: 6 }}>
                        {m.decision.reasonCode}
                      </span>
                    </div>
                  )}
                  <div className="msg-time">{m.ts.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg">
                <div className="msg-av ai">⬡</div>
                <div className="msg-body">
                  <div className="msg-text" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="spin" style={{ borderTopColor: "var(--accent)" }} />
                    <span style={{ color: "var(--text-3)", fontSize: 12 }}>Evaluating with backend…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
              placeholder="Ask about an authorization action…"
              disabled={loading}
              aria-label="Message input"
            />
            <button className="btn btn-primary" onClick={() => send(input)} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>

        {/* Suggestions panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="card card-p">
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 10 }}>
              Example Prompts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SUGGESTIONS.map(s => (
                <button key={s.key} className="btn btn-ghost btn-sm"
                  style={{ textAlign: "left", justifyContent: "flex-start", whiteSpace: "normal", height: "auto", lineHeight: 1.4 }}
                  onClick={() => send(s.label)} disabled={loading}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card card-p">
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
              Security Model
            </div>
            {[
              ["Identity",    "Server-resolved"],
              ["Decision",    "Backend gateway"],
              ["AI role",     "Propose only"],
              ["Audit",       "All attempts logged"],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "5px 0", borderBottom: "1px solid var(--border-soft)", fontSize: 11.5,
              }}>
                <span style={{ color: "var(--text-3)" }}>{k}</span>
                <span style={{ color: "var(--green)", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
