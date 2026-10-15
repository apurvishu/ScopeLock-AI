import { useState, useEffect } from "react";
import "./App.css";
import { UserProvider, useUser, DEMO_USERS } from "./context/UserContext";
import Dashboard   from "./pages/Dashboard";
import AuditLog    from "./pages/AuditLog";
import Firewall    from "./pages/Firewall";
import AIAssistant from "./pages/AIAssistant";
import About       from "./pages/About";
import { api } from "./api";

type Page = "dashboard" | "audit" | "firewall" | "ai" | "about";

const NAV: Array<{ id: Page; label: string; icon: string; group?: string }> = [
  { id: "dashboard", label: "Overview",    icon: "⊡", group: "MONITOR" },
  { id: "audit",     label: "Audit Logs",  icon: "≡" },
  { id: "ai",        label: "AI Assistant",icon: "◎", group: "PROTECT" },
  { id: "firewall",  label: "Firewall",    icon: "⬡" },
  { id: "about",     label: "About",       icon: "◉", group: "SYSTEM" },
];

const TITLES: Record<Page, { title: string; desc: string }> = {
  dashboard: { title: "Overview",            desc: "Authorization metrics and activity" },
  audit:     { title: "Audit Logs",          desc: "Persisted authorization events" },
  firewall:  { title: "Authorization Firewall", desc: "Live policy evaluation" },
  ai:        { title: "AI Assistant",        desc: "Policy-aware authorization assistant" },
  about:     { title: "About",               desc: "ScopeLock AI · Trustworthy and Verifiable AI" },
};

type ConnStatus = "ok" | "wait" | "err";

function Shell() {
  const [page, setPage] = useState<Page>("dashboard");
  const { user, setUser } = useUser();
  const [conn, setConn] = useState<ConnStatus>("wait");

  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        await api.health();
        if (alive) setConn("ok");
      } catch {
        if (alive) setConn("err");
      }
    };
    ping();
    const t = setInterval(ping, 12000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const { title, desc } = TITLES[page];

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-brand-mark">🔐</div>
          <div>
            <div className="sb-brand-name">ScopeLock AI</div>
            <div className="sb-brand-tag">Auth Firewall</div>
          </div>
        </div>

        <nav className="sb-nav">
          {NAV.map(n => (
            <div key={n.id}>
              {n.group && <div className="sb-section">{n.group}</div>}
              <button
                className={`nav-btn ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
                aria-current={page === n.id ? "page" : undefined}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="id-switcher">
            <div className="id-demo-label">
              <span>⚠</span> Demo Environment
            </div>
            <select
              className="id-select"
              value={user.id}
              aria-label="Select demo identity"
              onChange={e => {
                const u = DEMO_USERS.find(x => x.id === e.target.value);
                if (u) setUser(u);
              }}
            >
              {DEMO_USERS.map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <div className="id-info">
              <div className="id-avatar">{user.id[0].toUpperCase()}</div>
              <div>
                <div className="id-name">{user.id}</div>
                <div className="id-role">{user.role} · {user.department}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-wrap">
        <header className="header">
          <div className="header-left">
            <span className="header-title">{title}</span>
            <span className="header-desc">{desc}</span>
          </div>
          <div className="header-right">
            <div className={`conn-pill ${conn}`}>
              <span className={`dot ${conn === "ok" ? "pulse" : ""}`} />
              {conn === "ok"   ? "port 4000" :
               conn === "wait" ? "Connecting…" :
               "Backend offline"}
            </div>
          </div>
        </header>

        <div className="content fadein" key={page}>
          {page === "dashboard" && <Dashboard />}
          {page === "audit"     && <AuditLog />}
          {page === "firewall"  && <Firewall />}
          {page === "ai"        && <AIAssistant />}
          {page === "about"     && <About />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Shell />
    </UserProvider>
  );
}
