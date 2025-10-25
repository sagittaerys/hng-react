import { useState, useEffect } from "react";
interface Ticket {
        userId: string;
        status: 'open' | 'closed';
      }

      interface SessionData {
        userId: string;
        name?: string;
        expiresAt: string;
      }

export default function Dashboard({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [user, setUser] = useState<SessionData | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0
  });

  useEffect(() => {
    // checking authentication
    const session = localStorage.getItem("ticketapp_session");
    
    // if not in session this gets routed to login
    if (!session) {
      onNavigate("/login");
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      
      // check if session is expired
      if (new Date(sessionData.expiresAt) < new Date()) {
        localStorage.removeItem("ticketapp_session");
        onNavigate("/login");
        return;
      }

      setUser(sessionData);

      // Load tickets and calculate stats
      const tickets = JSON.parse(localStorage.getItem("ticketapp_tickets") || "[]");
      
            const userTickets = tickets.filter((t: Ticket) => t.userId === sessionData.userId);
      
      const openCount: number = userTickets.filter((t: Ticket) => t.status === "open").length;
      const resolvedCount: number = userTickets.filter((t: Ticket) => t.status === "closed").length;
      
      setStats({
        total: userTickets.length,
        open: openCount,
        resolved: resolvedCount
      });
    } catch (err) {
      console.error("Session error:", err);
      localStorage.removeItem("ticketapp_session");
      onNavigate("/login");
    }
  }, [onNavigate]);

  function handleLogout() {
    localStorage.removeItem("ticketapp_session");
    onNavigate("/");
  }

  if (!user) return null;

  return (
    <>
    
     

      <div className="dashboard-wrapper">
        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-container">
            <div className="dashboard-title-section">
              <div>
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">
                  Welcome back, {user.name?.split(' ')[0] || 'User'}!
                </p>
              </div>
              <button 
                className="manage-btn"
                onClick={() => onNavigate("/tickets")}
              >
                Manage Tickets
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Tickets</div>
                <div className="stat-value">{stats.total.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Open Tickets</div>
                <div className="stat-value">{stats.open.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Resolved Tickets</div>
                <div className="stat-value">{stats.resolved.toLocaleString()}</div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="logout-section">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}