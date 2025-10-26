import { useState, useEffect } from "react";
import { IoTicketOutline } from "react-icons/io5";

interface Ticket {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface FormErrors {
  title?: string;
  status?: string;
  description?: string;
}

interface SessionData {
  userId: string;
  name?: string;
  email: string;
  expiresAt: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: string;
}

export default function TicketsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [user, setUser] = useState<SessionData | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open" as 'open' | 'in_progress' | 'closed',
    priority: "medium" as 'low' | 'medium' | 'high',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const session = localStorage.getItem("ticketapp_session");

    if (!session) {
      onNavigate("/login");
      return;
    }

    try {
      const sessionData: SessionData = JSON.parse(session);

      if (new Date(sessionData.expiresAt) < new Date()) {
        localStorage.removeItem("ticketapp_session");
        onNavigate("/login");
        return;
      }

      setUser(sessionData);
      loadTickets(sessionData.userId);
    } catch (err) {
      console.error("Session error:", err);
      localStorage.removeItem("ticketapp_session");
      onNavigate("/login");
    }
  }, [onNavigate]);

  function loadTickets(userId: string): void {
    const allTickets: Ticket[] = JSON.parse(
      localStorage.getItem("ticketapp_tickets") || "[]"
    );
    const userTickets: Ticket[] = allTickets.filter((t) => t.userId === userId);
    setTickets(userTickets);
  }

  function validateForm(): boolean {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!formData.status) {
      errors.status = "Status is required.";
    } else if (!["open", "in_progress", "closed"].includes(formData.status)) {
      errors.status = "Status must be 'open', 'in_progress', or 'closed'.";
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = "Description must be less than 500 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function showToast(message: string, type: string): void {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  }

  function handleCreate(): void {
    setEditingTicket(null);
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setFormErrors({});
    setShowModal(true);
  }

  function handleEdit(ticket: Ticket): void {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || "",
      status: ticket.status,
      priority: ticket.priority || "medium",
    });
    setFormErrors({});
    setShowModal(true);
  }

  function handleSave(): void {
    if (!validateForm()) {
      showToast("Please fix the errors in the form.", "error");
      return;
    }

    const allTickets: Ticket[] = JSON.parse(
      localStorage.getItem("ticketapp_tickets") || "[]"
    );

    if (editingTicket && user) {
      const updatedTickets = allTickets.map((t) =>
        t.id === editingTicket.id
          ? { ...t, ...formData, updatedAt: new Date().toISOString() }
          : t
      );
      localStorage.setItem("ticketapp_tickets", JSON.stringify(updatedTickets));
      showToast("Ticket updated successfully!", "success");
    } else if (user) {
      const newTicket: Ticket = {
        id: Date.now().toString(),
        userId: user.userId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      allTickets.push(newTicket);
      localStorage.setItem("ticketapp_tickets", JSON.stringify(allTickets));
      showToast("Ticket created successfully!", "success");
    }

    setShowModal(false);
    if (user) loadTickets(user.userId);
  }

  function handleDeleteClick(ticket: Ticket): void {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
  }

  function handleDeleteConfirm(): void {
    if (!ticketToDelete || !user) return;

    const allTickets: Ticket[] = JSON.parse(
      localStorage.getItem("ticketapp_tickets") || "[]"
    );
    const updatedTickets = allTickets.filter((t) => t.id !== ticketToDelete.id);
    localStorage.setItem("ticketapp_tickets", JSON.stringify(updatedTickets));

    showToast("Ticket deleted successfully!", "success");
    setShowDeleteConfirm(false);
    setTicketToDelete(null);
    loadTickets(user.userId);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "open":
        return "#10b981";
      case "in_progress":
        return "#f59e0b";
      case "closed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  }

  if (!user) return null;

  return (
    <>

      <div className="tickets-wrapper">
        <div className="tickets-container">
          <div className="tickets-header">
            <h1 className="tickets-title">Manage Tickets</h1>
            <div className="duex-btns">
              <button className="back-btn" onClick={() => onNavigate("/dashboard")}>
                ← Back to Dashboard
              </button>
              <button className="create-btn" onClick={handleCreate}>
                + Create Ticket
              </button>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"> <IoTicketOutline /> </div>
              <h2 className="empty-state-title">No tickets yet</h2>
              <p className="empty-state-text">Create your first ticket to get started</p>
              <button className="create-btn" onClick={handleCreate}>
                Create Ticket
              </button>
            </div>
          ) : (
            <div className="tickets-grid">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(ticket.status) }}
                    >
                      {getStatusLabel(ticket.status)}
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="ticket-description">{ticket.description}</p>
                  )}
                  <div className="ticket-meta">
                    <span className="priority-badge">Priority: {ticket.priority}</span>
                    <div className="ticket-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(ticket)}>
                        Edit
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteClick(ticket)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-header">
              {editingTicket ? "Edit Ticket" : "Create New Ticket"}
            </h2>

            <div className="form-group">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${formErrors.title ? "error" : ""}`}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter ticket title"
              />
              {formErrors.title && <p className="error-message">{formErrors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className={`form-textarea ${formErrors.description ? "error" : ""}`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter ticket description"
              />
              {formErrors.description && <p className="error-message">{formErrors.description}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Status <span className="required">*</span>
              </label>
              <select
                className={`form-select ${formErrors.status ? "error" : ""}`}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              {formErrors.status && <p className="error-message">{formErrors.status}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary" onClick={handleSave}>
                {editingTicket ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Delete Ticket</h3>
            <p className="confirm-text">
              Are you sure you want to delete "{ticketToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="confirm-btn confirm-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn confirm-btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </>
  );
}