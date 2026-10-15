import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import type { AuditEvent } from "../api";
import { useUser } from "../context/UserContext";

const DECISIONS = ["", "ALLOW", "DENY"];

export default function AuditLog() {
  const { user } = useUser();
  const [items, setItems]     = useState<AuditEvent[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [decision, setDec]    = useState("");
  const [lastAt, setLastAt]   = useState("");
  const PAGE_SIZE = 15;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.audit({ page, pageSize: PAGE_SIZE, decision: decision || undefined }, user.id);
      setItems(r.items);
      setTotal(r.pagination.total);
      setLastAt(new Date().toLocaleTimeString());
    } catch (e: any) {
      setError(e.message ?? "Cannot load audit log");
    } finally {
      setLoading(false);
    }
  }, [page, decision, user.id]);

  useEffect(() => { load(); }, [load]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Audit Log</h2>
          <div className="ph-sub">
            {total > 0 ? `${total} persisted events` : "All authorization attempts are logged"}
            {lastAt && <span style={{ marginLeft: 8, color: "var(--text-3)" }}>· {lastAt}</span>}
          </div>
        </div>
        <div className="ph-actions">
          <select
            value={decision}
            onChange={e => { setDec(e.target.value); setPage(1); }}
            style={{ width: "auto", fontSize: 12, padding: "5px 8px" }}
            aria-label="Filter by decision"
          >
            {DECISIONS.map(d => <option key={d} value={d}>{d || "All decisions"}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
            {loading ? <span className="spin" /> : "↻"} Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-err">
          <span>⚠</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn-ghost btn-sm" onClick={load}>Retry</button>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skel" style={{ height: 18, opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state" style={{ padding: "48px 24px" }}>
            <span className="empty-icon">≡</span>
            <span className="empty-title">No events found</span>
            <span className="empty-sub">
              {decision ? `No ${decision} decisions recorded yet` : "Run authorization tests on the Overview page to generate audit events"}
            </span>
          </div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Decision</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {items.map(e => (
                  <tr key={e.event_id}>
                    <td className="mono text3" style={{ whiteSpace: "nowrap" }}>
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text-1)" }}>
                      {e.principal_id ?? "—"}
                    </td>
                    <td className="mono" style={{ color: "var(--text-2)" }}>
                      {e.action}
                    </td>
                    <td className="mono text3">
                      {e.resource_type}{e.resource_id ? `/${e.resource_id}` : ""}
                    </td>
                    <td>
                      <span className={`badge ${e.decision === "ALLOW" ? "badge-allow" : "badge-deny"}`}>
                        {e.decision === "ALLOW" ? "✓" : "✕"} {e.decision}
                      </span>
                    </td>
                    <td className="mono text3" style={{ fontSize: 11 }}>
                      {e.reason_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", borderTop: "1px solid var(--border-soft)"
          }}>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              Page {page} of {pages} · {total} total
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <button className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
