import { useState } from "react";
import { api } from "../api";
import { useUser } from "../context/UserContext";

const POLICIES = [
  { action: "read_own_profile",          rt: "employee", label: "Read own profile",       desc: "Employees may read their own record" },
  { action: "read_salary",               rt: "employee", label: "Read salary",             desc: "Employees can only read their own salary" },
  { action: "list_department_employees", rt: "employee", label: "List dept employees",     desc: "Managers may list their department" },
  { action: "update_department",         rt: "employee", label: "Update department",       desc: "Admin-only operation" },
  { action: "delete_record",             rt: "employee", label: "Delete record",           desc: "Admin-only operation" },
];

type Decision = { decision: "ALLOW" | "DENY"; reasonCode: string; decisionId: string; principalId?: string } | null;

export default function Firewall() {
  const { user } = useUser();
  const [action, setAction]   = useState(POLICIES[0].action);
  const [resourceId, setRid]  = useState("employee_101");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Decision>(null);
  const [history, setHistory] = useState<Array<{ action: string; rid: string; res: Decision }>>([]);

  async function evaluate() {
    const pol = POLICIES.find(p => p.action === action)!;
    setLoading(true);
    setResult(null);
    try {
      const r = await api.authorizeAction(action, pol.rt, resourceId, user.id);
      setResult(r.decision as Decision);
      setHistory(h => [{ action, rid: resourceId, res: r.decision as Decision }, ...h.slice(0, 9)]);
    } catch (e: any) {
      setResult(null);
      alert(`Request failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const pol = POLICIES.find(p => p.action === action);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14 }}>
      {/* Left: evaluator */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 3 }}>Authorization Firewall</h2>
          <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>
            Evaluate backend policy decisions · Acting as <strong style={{ color: "var(--accent)" }}>{user.label}</strong>
          </div>
        </div>

        {/* Form */}
        <div className="card card-p">
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 14 }}>Evaluate Policy</div>

          <div className="form-row">
            <label className="form-label">Principal (Identity)</label>
            <input value={`${user.id} (${user.role} · ${user.department})`} readOnly />
          </div>

          <div className="form-row">
            <label className="form-label">Action</label>
            <select value={action} onChange={e => setAction(e.target.value)}>
              {POLICIES.map(p => <option key={p.action} value={p.action}>{p.label}</option>)}
            </select>
            {pol && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{pol.desc}</div>}
          </div>

          <div className="form-row">
            <label className="form-label">Resource ID</label>
            <select value={resourceId} onChange={e => setRid(e.target.value)}>
              <option value="employee_101">employee_101 (Alice)</option>
              <option value="employee_102">employee_102 (Bob)</option>
              <option value="employee_103">employee_103 (Carol)</option>
              <option value="employee_104">employee_104 (David)</option>
              <option value="employee_105">employee_105 (Admin)</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: "100%" }} onClick={evaluate} disabled={loading}>
            {loading ? <><span className="spin" /> Evaluating…</> : "⬡ Evaluate Authorization"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`decision ${result.decision.toLowerCase()}`}>
            <div className="decision-emoji">{result.decision === "ALLOW" ? "✅" : "🚫"}</div>
            <div className={`decision-v ${result.decision.toLowerCase()}`}>
              {result.decision === "ALLOW" ? "Access Permitted" : "Access Denied"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 10, textAlign: "left" }}>
              {[
                ["Principal",  user.id],
                ["Role",       user.role],
                ["Action",     action],
                ["Resource",   resourceId],
                ["Decision",   result.decision],
                ["Reason",     result.reasonCode],
                ["Decision ID",result.decisionId?.slice(0, 16) + "…"],
              ].map(([k, v]) => (
                <div key={k} className="decision-row">
                  <span className="decision-k">{k}</span>
                  <span className="decision-v2">{v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 10 }}>
              Decision is server-enforced · logged to audit trail
            </div>
          </div>
        )}
      </div>

      {/* Right: history + policy reference */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Decision history */}
        <div className="card card-p">
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 10 }}>
            Decision History
          </div>
          {history.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-3)", padding: "8px 0" }}>
              No decisions yet — evaluate a policy above.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {history.map((h, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 0", borderBottom: i < history.length - 1 ? "1px solid var(--border-soft)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--text-2)" }}>{h.action}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-3)" }}>{h.rid}</div>
                  </div>
                  {h.res && (
                    <span className={`badge ${h.res.decision === "ALLOW" ? "badge-allow" : "badge-deny"}`}>
                      {h.res.decision}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Policy reference */}
        <div className="card card-p">
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 10 }}>
            Policy Reference
          </div>
          {[
            { role: "EMPLOYEE", perms: ["Read own profile", "Read own salary"] },
            { role: "MANAGER",  perms: ["All employee permissions", "List department employees"] },
            { role: "ADMIN",    perms: ["All manager permissions", "Update department", "Delete record"] },
          ].map(r => (
            <div key={r.role} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: r.role === "EMPLOYEE" ? "var(--accent)" : r.role === "MANAGER" ? "var(--amber)" : "var(--red)", marginBottom: 4 }}>
                {r.role}
              </div>
              {r.perms.map(p => (
                <div key={p} style={{ fontSize: 11.5, color: "var(--text-3)", paddingLeft: 8, marginBottom: 2 }}>
                  · {p}
                </div>
              ))}
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 8, lineHeight: 1.5 }}>
            All decisions are enforced server-side. Identity is never trusted from the client.
          </div>
        </div>
      </div>
    </div>
  );
}
