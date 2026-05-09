
"use client";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────
type NotifyTo = "all" | "customer" | "staff" | "admin" | "crew";
type Gender = "all" | "male" | "female";
type FilterTab = "all" | "unread";

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  notifyTo: NotifyTo;
  unread: boolean;
  icon: string;
  iconBg: string;
  tagBg: string;
  tagColor: string;
}

// ─── Constants ───────────────────────────────────────────
const NOTIFY_LABELS: Record<NotifyTo, string> = {
  all: "👥 All",
  customer: "👤 Customer",
  staff: "🧑‍💼 Staff",
  admin: "🛡️ Admin",
  crew: "👨‍✈️ Crew",
};

const CUSTOMERS = [
  { id: "1", name: "Rahul Sharma" },
  { id: "2", name: "Priya Mehta" },
  { id: "3", name: "Sneha Patil" },
  { id: "4", name: "Vikram Nair" },
  { id: "5", name: "Amit Kumar" },
  { id: "6", name: "Neha Singh" },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New Booking Created", desc: "Booking #BK-2041 created by Rahul Sharma for IndiGo Airlines.", time: "2 min ago", notifyTo: "customer", unread: true, icon: "📦", iconBg: "#dbeafe", tagBg: "#dbeafe", tagColor: "#1d4ed8" },
  { id: 2, title: "New Customer Registered", desc: "Priya Mehta registered as a new customer. Profile pending verification.", time: "15 min ago", notifyTo: "customer", unread: true, icon: "👤", iconBg: "#dcfce7", tagBg: "#dcfce7", tagColor: "#16a34a" },
  { id: 3, title: "Booking Status Updated", desc: "Booking #BK-2038 changed from Pending to Confirmed — Vistara.", time: "42 min ago", notifyTo: "all", unread: true, icon: "✈️", iconBg: "#dbeafe", tagBg: "#dbeafe", tagColor: "#1d4ed8" },
  { id: 4, title: "Staff Role Changed", desc: "Amit Kumar role updated from Agent to Manager by Admin.", time: "1 hr ago", notifyTo: "staff", unread: true, icon: "👥", iconBg: "#fef3c7", tagBg: "#fef3c7", tagColor: "#d97706" },
  { id: 5, title: "Rate Card Expiring Soon", desc: "Rate card for SpiceJet Airlines expires in 3 days.", time: "2 hr ago", notifyTo: "admin", unread: true, icon: "⚠️", iconBg: "#fee2e2", tagBg: "#fee2e2", tagColor: "#dc2626" },
  { id: 6, title: "Booking Cancelled", desc: "Booking #BK-2034 cancelled by Sneha Patil. Refund initiated.", time: "Yesterday", notifyTo: "customer", unread: false, icon: "📦", iconBg: "#dbeafe", tagBg: "#dbeafe", tagColor: "#1d4ed8" },
  { id: 7, title: "System Backup Completed", desc: "Daily backup completed at 02:00 AM. All data secured.", time: "Yesterday", notifyTo: "admin", unread: false, icon: "⚙️", iconBg: "#f3e8ff", tagBg: "#f3e8ff", tagColor: "#7c3aed" },
  { id: 8, title: "Customer Profile Updated", desc: "Vikram Nair updated profile. Documents pending re-verification.", time: "2 days ago", notifyTo: "customer", unread: false, icon: "👤", iconBg: "#dcfce7", tagBg: "#dcfce7", tagColor: "#16a34a" },
];

// ─── Main Component ───────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [toast, setToast] = useState(false);

  // Form state
  const [notifyTo, setNotifyTo] = useState<NotifyTo | "">("");
  const [customerId, setCustomerId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState<Gender>("all");
  const [scheduleOn, setScheduleOn] = useState(false);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtered notifications
  const filtered = notifications.filter((n) =>
    activeTab === "all" ? true : n.unread
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Mark single as read
  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // Mark all as read
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Validate & Send
  const handleSend = () => {
    const newErrors: Record<string, string> = {};
    if (!notifyTo) newErrors.notifyTo = "Please select who to notify.";
    if (notifyTo === "customer" && !customerId) newErrors.customer = "Please select a customer.";
    if (!title.trim()) newErrors.title = "Please enter a title.";
    if (!message.trim()) newErrors.message = "Please enter a message.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newNotif: Notification = {
      id: Date.now(),
      title: title.trim(),
      desc: message.trim(),
      time: "Just now",
      notifyTo: notifyTo as NotifyTo,
      unread: true,
      icon: "🔔",
      iconBg: "#dbeafe",
      tagBg: "#dbeafe",
      tagColor: "#1d4ed8",
    };

    setNotifications((prev) => [newNotif, ...prev]);
    resetForm();
    showToast();
  };

  const resetForm = () => {
    setNotifyTo("");
    setCustomerId("");
    setTitle("");
    setMessage("");
    setGender("all");
    setScheduleOn(false);
    setSchedDate("");
    setSchedTime("");
    setErrors({});
  };

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif", background: "#f5f6fa" }}>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>


        {/* Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* LEFT: New Notification Form */}
          <div style={{ flex: 1, overflow: "hidden", padding: "10px", background: "#f5f6fa", borderRight: "1px solid #e8eaf0" }}>
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e8eaf0", padding: "20px", height: "100%", overflow: "hidden" }}>

              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>
                New Notification
              </h2>

              {/* BASIC INFORMATION */}
              <SectionLabel text="Basic Information" />

                 {/* Gender */}
              <FormRow>
                <FormLabel text="Gender" />
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["all", "male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={genderChipStyle(gender === g)}
                    >
                      {g === "all" ? "👥" : g === "male" ? "👨" : "👩"} {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </FormRow>

              {/* Notify To */}
              <FormRow>
                <FormLabel text="Notify To" required />
                <select
                  value={notifyTo}
                  onChange={(e) => {
                    setNotifyTo(e.target.value as NotifyTo | "");
                    setCustomerId("");
                    setErrors((prev) => ({ ...prev, notifyTo: "", customer: "" }));
                  }}
                  style={selectStyle(!!errors.notifyTo)}
                >
                  <option value="" disabled>-- Select who to notify --</option>
                  <option value="all">👥 All</option>
                  <option value="customer">👤 Customer</option>
                  <option value="staff">🧑‍💼 Staff</option>
                  <option value="admin">🛡️ Admin</option>
                  <option value="crew">👨‍✈️ Crew</option>
                </select>
                {errors.notifyTo && <ErrMsg text={errors.notifyTo} />}
              </FormRow>

              {/* Customer Dropdown */}
              {notifyTo === "customer" && (
                <FormRow>
                  <FormLabel text="Select Customer" required />
                  <select
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value);
                      setErrors((prev) => ({ ...prev, customer: "" }));
                    }}
                    style={selectStyle(!!errors.customer)}
                  >
                    <option value="" disabled>-- Select customer --</option>
                    {CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.id}>👤 {c.name}</option>
                    ))}
                  </select>
                  {errors.customer && <ErrMsg text={errors.customer} />}
                </FormRow>
              )}

              {/* Title */}
              <FormRow>
                <FormLabel text="Title" required />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                  placeholder="e.g. New Booking Confirmed"
                  style={inputStyle(!!errors.title)}
                />
                {errors.title && <ErrMsg text={errors.title} />}
              </FormRow>

              {/* Message */}
              <FormRow>
                <FormLabel text="Message" required />
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: "" })); }}
                  placeholder="Write notification message here..."
                  rows={4}
                  style={{ ...inputStyle(!!errors.message), resize: "vertical", lineHeight: "1.55" }}
                />
                {errors.message && <ErrMsg text={errors.message} />}
              </FormRow>

              {/* DELIVERY SETTINGS */}
              <SectionLabel text="Delivery Settings" topMargin />

              {/* Gender
              <FormRow>
                <FormLabel text="Gender" />
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["all", "male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={genderChipStyle(gender === g)}
                    >
                      {g === "all" ? "👥" : g === "male" ? "👨" : "👩"} {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </FormRow> */}

              {/* Schedule */}
              <FormRow>
                <FormLabel text="Schedule" />
                <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
                  <div onClick={() => setScheduleOn(!scheduleOn)} style={toggleWrapStyle(scheduleOn)}>
                    <div style={toggleKnobStyle(scheduleOn)} />
                  </div>
                  <span style={{ fontSize: "12.5px", color: "#475569", fontWeight: 500 }}>
                    {scheduleOn ? "Schedule for later" : "Send immediately"}
                  </span>
                </div>
                {scheduleOn && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "5px" }}>Date</label>
                      <input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} style={inputStyle(false)} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "5px" }}>Time</label>
                      <input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} style={inputStyle(false)} />
                    </div>
                  </div>
                )}
              </FormRow>

              {/* Footer Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", marginTop: "4px" }}>
                <button onClick={resetForm} style={btnResetStyle}>Reset</button>
                <button onClick={handleSend} style={btnSendStyle}>🔔 Send Notification</button>
              </div>

            </div>
          </div>

          {/* RIGHT: Notification List */}
          <div style={{ width: "420px", flexShrink: 0, display: "flex", flexDirection: "column", borderLeft: "1px solid #e8eaf0", background: "#fff", overflow: "hidden" }}>

            {/* Panel Header */}
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>Notifications</span>
                <button onClick={markAllRead} style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: "4px 8px", borderRadius: "5px" }}>
                  ✓ Mark all read
                </button>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: "flex", gap: "3px", background: "#f1f5f9", borderRadius: "8px", padding: "3px", width: "fit-content" }}>
                {(["all", "unread"] as FilterTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={tabStyle(activeTab === tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "all" && (
                      <span style={cntStyle}>{notifications.length}</span>
                    )}
                    {tab === "unread" && (
                      <span style={cntStyle}>{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Items */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: "13px" }}>
                  No notifications found
                </div>
              ) : (
                filtered.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "12px",
                      padding: "14px 20px", borderBottom: "1px solid #f8fafc",
                      cursor: "pointer", position: "relative",
                      background: n.unread ? "#eff6ff" : "white",
                      transition: "background 0.12s",
                    }}
                  >
                    {n.unread && (
                      <div style={{ position: "absolute", left: "7px", top: "50%", transform: "translateY(-50%)", width: "6px", height: "6px", background: "#2563eb", borderRadius: "50%" }} />
                    )}
                    <div style={{ width: "36px", height: "36px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, background: n.iconBg }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                        {n.desc}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "5px" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{n.time}</span>
                        <span style={{ fontSize: "10.5px", padding: "1px 7px", borderRadius: "20px", fontWeight: 500, background: n.tagBg, color: n.tagColor }}>
                          {NOTIFY_LABELS[n.notifyTo]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#1e293b", color: "white", padding: "11px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "7px", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", zIndex: 200 }}>
          ✅ Notification sent successfully!
        </div>
      )}

    </div>
  );
}

// ─── Sub Components ───────────────────────────────────────

function Sidebar() {
  const navItems = [
    { icon: "🏠", label: "Dashboard" },
    { icon: "👤", label: "Customers" },
    { icon: "👥", label: "Staff" },
    { icon: "✈️", label: "Airlines" },
    { icon: "📅", label: "Booking" },
    { icon: "🚚", label: "Logistics" },
    { icon: "🏙️", label: "Cities" },
    { icon: "🔔", label: "Notifications", active: true },
  ];
  const rbacItems = [
    { icon: "🛡️", label: "Admin" },
    { icon: "🔑", label: "Roles & Permissions" },
    { icon: "⚙️", label: "Feature" },
  ];
  const systemItems = [
    { icon: "⚙️", label: "Settings" },
    { icon: "📋", label: "System-log" },
  ];

  return (
    <div style={{ width: "240px", background: "#fff", borderRight: "1px solid #e8eaf0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "18px 16px", borderBottom: "1px solid #f0f0f5" }}>
        <div style={{ width: "36px", height: "36px", background: "#2563eb", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "17px" }}>📦</div>
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e" }}>Dropty CRM</span>
      </div>
      <ul style={{ listStyle: "none", padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        {navItems.map((item) => (
          <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "13.5px", fontWeight: 500, color: item.active ? "white" : "#64748b", background: item.active ? "#2563eb" : "transparent", marginBottom: "1px" }}>
            <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </li>
        ))}
        <li style={{ padding: "8px 12px 3px", fontSize: "10.5px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>RBAC</li>
        {rbacItems.map((item) => (
          <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 12px 9px 24px", borderRadius: "7px", cursor: "pointer", fontSize: "13.5px", fontWeight: 500, color: "#64748b", marginBottom: "1px" }}>
            <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </li>
        ))}
        <li style={{ padding: "8px 12px 3px", fontSize: "10.5px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>System</li>
        {systemItems.map((item) => (
          <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 12px 9px 24px", borderRadius: "7px", cursor: "pointer", fontSize: "13.5px", fontWeight: 500, color: "#64748b", marginBottom: "1px" }}>
            <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
      <div style={{ padding: "10px", borderTop: "1px solid #f0f0f5", fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>© 2026 Dropty</div>
    </div>
  );
}

function Topbar({ unreadCount }: { unreadCount: number }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e8eaf0", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13.5px", color: "#64748b" }}>
        <span>Home</span>
        <span style={{ color: "#cbd5e1" }}>›</span>
        <span style={{ color: "#1e293b", fontWeight: 500 }}>Notifications</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ position: "relative", cursor: "pointer", fontSize: "19px" }}>
          🔔
          {unreadCount > 0 && (
            <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "15px", height: "15px", background: "#ef4444", borderRadius: "50%", fontSize: "8px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {unreadCount}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }}>
          <div style={{ width: "34px", height: "34px", background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "13px" }}>D</div>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b" }}>dipti2001singh@gmail.com</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Admin</div>
          </div>
          <span style={{ color: "#94a3b8", fontSize: "11px" }}>▼</span>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ text, topMargin }: { text: string; topMargin?: boolean }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #f1f5f9", marginTop: topMargin ? "14px" : 0 }}>
      {text}
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: "10px" }}>{children}</div>;
}

function FormLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
      {text} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
  );
}

function ErrMsg({ text }: { text: string }) {
  return <div style={{ fontSize: "11.5px", color: "#ef4444", marginTop: "4px" }}>{text}</div>;
}

// ─── Styles ───────────────────────────────────────────────

const baseInputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #e2e8f0", borderRadius: "8px",
  fontSize: "13px", fontFamily: "'Inter', sans-serif",
  color: "#1e293b", background: "#fff", outline: "none",
};

const inputStyle = (error: boolean): React.CSSProperties => ({
  ...baseInputStyle,
  border: `1px solid ${error ? "#ef4444" : "#e2e8f0"}`,
  boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
});

const selectStyle = (error: boolean): React.CSSProperties => ({
  ...inputStyle(error),
  appearance: "none",
  // backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
  cursor: "pointer",
});

const genderChipStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px", borderRadius: "18px",
  border: `1.5px solid ${active ? "#2563eb" : "#e2e8f0"}`,
  background: active ? "#dbeafe" : "white",
  color: active ? "#1d4ed8" : "#64748b",
  fontSize: "12px", fontWeight: 500,
  cursor: "pointer", transition: "all 0.15s",
});

const toggleWrapStyle = (on: boolean): React.CSSProperties => ({
  width: "38px", height: "20px",
  background: on ? "#2563eb" : "#e2e8f0",
  borderRadius: "20px", position: "relative",
  cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
});

const toggleKnobStyle = (on: boolean): React.CSSProperties => ({
  position: "absolute", top: "2px",
  left: on ? "20px" : "2px",
  width: "16px", height: "16px",
  background: "white", borderRadius: "50%",
  transition: "left 0.2s",
  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
});

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "5px 14px", borderRadius: "6px",
  fontSize: "12px", fontWeight: active ? 600 : 500,
  cursor: "pointer", color: active ? "#1e293b" : "#64748b",
  border: "none", background: active ? "white" : "none",
  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
  transition: "all 0.15s",
});

const cntStyle: React.CSSProperties = {
  background: "#2563eb", color: "white",
  borderRadius: "20px", fontSize: "9px",
  padding: "1px 5px", marginLeft: "4px", fontWeight: 700,
};

const btnResetStyle: React.CSSProperties = {
  background: "white", color: "#64748b",
  border: "1px solid #e2e8f0", padding: "9px 18px",
  borderRadius: "8px", fontSize: "13px", fontWeight: 500,
  cursor: "pointer",
};

const btnSendStyle: React.CSSProperties = {
  background: "#2563eb", color: "white",
  border: "none", padding: "9px 20px",
  borderRadius: "8px", fontSize: "13px", fontWeight: 600,
  cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
};
