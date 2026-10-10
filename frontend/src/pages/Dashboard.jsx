import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, LayoutDashboard, CalendarDays, CircleCheck, Clock3, Search, Plus, Bell, ChevronDown, LogOut, Menu, X, Pencil, Trash2, Check, ListTodo, Sparkles, AlertCircle } from "lucide-react";
import api from "../api";

const emptyForm = { title: "", description: "", priority: "medium", category: "Personal", due_date: "", completed: false };
const todayISO = () => new Date().toISOString().slice(0, 10);
const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No deadline";

function TaskModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function change(key, value) { setForm(prev => ({ ...prev, [key]: value })); }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { await onSave({ ...form, due_date: form.due_date || null }); onClose(); }
    catch (err) { setError(err.response?.data?.detail || "Could not save task."); }
    finally { setBusy(false); }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <form className="task-modal" onSubmit={submit}>
      <div className="modal-head"><div><span className="eyebrow">{initial?.id ? "KEEP IT MOVING" : "A NEW BEGINNING"}</span><h2>{initial?.id ? "Edit task" : "Create a task"}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X size={19}/></button></div>
      <label>Task title<input className="field" value={form.title} onChange={e=>change("title",e.target.value)} placeholder="What needs to get done?" maxLength="200" required autoFocus/></label>
      <label>Description <span className="optional">(optional)</span><textarea className="field textarea" value={form.description || ""} onChange={e=>change("description",e.target.value)} placeholder="Add a few details…" maxLength="5000" rows="3"/></label>
      <div className="form-grid">
        <label>Priority<select className="field" value={form.priority} onChange={e=>change("priority",e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label>Category<select className="field" value={form.category} onChange={e=>change("category",e.target.value)}>{["Personal","Work","Study","Health","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
      </div>
      <label>Due date<input className="field" type="date" min={todayISO()} value={form.due_date || ""} onChange={e=>change("due_date",e.target.value)}/></label>
      {error && <div className="error-box">{String(error)}</div>}
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={busy}>{busy ? "Saving…" : initial?.id ? "Save changes" : "Create task"} <span>→</span></button></div>
    </form>
  </div>;
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const overdue = !task.completed && task.due_date && task.due_date < todayISO();
  return <article className={`task-row ${task.completed ? "task-completed" : ""}`}>
    <button className={`task-check ${task.completed ? "checked" : ""}`} onClick={() => onToggle(task)} aria-label={task.completed ? "Mark pending" : "Mark completed"}>{task.completed && <Check size={15}/>}</button>
    <div className="task-main"><div className="task-title-line"><h3>{task.title}</h3><span className={`priority priority-${task.priority}`}>{task.priority}</span></div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta"><span className="category-pill">{task.category}</span><span className={overdue ? "date-label overdue" : "date-label"}><CalendarDays size={13}/>{overdue ? "Overdue · " : ""}{formatDate(task.due_date)}</span></div>
    </div>
    <div className="task-actions"><button className="icon-btn" onClick={()=>onEdit(task)} aria-label="Edit task"><Pencil size={15}/></button><button className="icon-btn delete-btn" onClick={()=>onDelete(task)} aria-label="Delete task"><Trash2 size={15}/></button></div>
  </article>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useMemo(() => { try { return JSON.parse(localStorage.getItem("todo_user") || "{}"); } catch { return {}; } }, []);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const [taskRes, statsRes] = await Promise.all([
        api.get("/api/tasks", { params: { status: filter, search } }),
        api.get("/api/tasks/stats"),
      ]);
      setTasks(taskRes.data); setStats(statsRes.data);
    } catch (err) { setError(err.response?.data?.detail || "Unable to load tasks. Check your API connection."); }
    finally { setBusy(false); }
  }, [filter, search]);

  useEffect(() => { const id = setTimeout(load, 220); return () => clearTimeout(id); }, [load]);

  async function saveTask(payload) {
    if (payload.id) await api.patch(`/api/tasks/${payload.id}`, payload);
    else await api.post("/api/tasks", payload);
    await load();
  }
  async function toggleTask(task) {
    try { await api.patch(`/api/tasks/${task.id}`, { completed: !task.completed }); await load(); }
    catch (err) { setError(err.response?.data?.detail || "Could not update task."); }
  }
  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try { await api.delete(`/api/tasks/${task.id}`); await load(); }
    catch (err) { setError(err.response?.data?.detail || "Could not delete task."); }
  }
  function logout() {
    localStorage.removeItem("todo_token"); localStorage.removeItem("todo_user"); navigate("/login");
  }

  const progress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const dateText = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return <div className="app-shell">
    {sidebarOpen && <button className="mobile-scrim" onClick={()=>setSidebarOpen(false)} aria-label="Close menu"/>}
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><span className="brand-icon"><CheckSquare size={21}/></span> focus<span className="brand-dot">.</span><button className="mobile-close icon-btn" onClick={()=>setSidebarOpen(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        <button className="nav-item active" onClick={()=>{setFilter("all");setSidebarOpen(false)}}><LayoutDashboard size={18}/> Overview</button>
        <button className={`nav-item ${filter==="pending"?"selected":""}`} onClick={()=>{setFilter("pending");setSidebarOpen(false)}}><ListTodo size={18}/> My tasks <span className="nav-count">{stats.pending}</span></button>
        <button className={`nav-item ${filter==="completed"?"selected":""}`} onClick={()=>{setFilter("completed");setSidebarOpen(false)}}><CircleCheck size={18}/> Completed</button>
        <button className={`nav-item ${filter==="overdue"?"selected":""}`} onClick={()=>{setFilter("overdue");setSidebarOpen(false)}}><Clock3 size={18}/> Overdue <span className="nav-count">{stats.overdue}</span></button>
      </nav>
      <div className="sidebar-bottom"><div className="focus-card"><span className="focus-orb"><Sparkles size={17}/></span><strong>Small steps add up.</strong><p>Keep showing up for the things that matter.</p><div className="mini-progress"><span style={{width:`${progress}%`}}/></div><div className="focus-card-foot"><span>Your progress</span><b>{progress}%</b></div></div>
        <button className="profile-row" onClick={logout}><div className="avatar">{(user.name || user.email || "U").slice(0,1).toUpperCase()}</div><div className="profile-copy"><b>{user.name || "Your account"}</b><span>{user.email || ""}</span></div><LogOut size={16}/></button>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{filter === "all" ? "Overview" : filter[0].toUpperCase()+filter.slice(1)}</b></div><div className="topbar-right"><span className="today-chip"><CalendarDays size={15}/>{new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"})}</span><div className="top-avatar">{(user.name || "U").slice(0,1).toUpperCase()}</div></div></header>
      <div className="dashboard-content">
        <div className="welcome-row"><div><span className="eyebrow">{dateText.toUpperCase()}</span><h1>Let's make today <span>count.</span></h1><p className="muted">A little progress each day adds up to big results.</p></div><button className="primary-btn add-main" onClick={()=>setModal({})}><Plus size={18}/> New task</button></div>
        {error && <div className="error-banner"><AlertCircle size={17}/>{String(error)}<button onClick={load}>Retry</button></div>}
        <section className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon violet"><ListTodo size={18}/></span></div><div className="stat-value">{stats.total}</div><div className="stat-foot">All your tasks in one place</div></div>
          <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green"><CircleCheck size={18}/></span></div><div className="stat-value">{stats.completed}</div><div className="stat-foot"><span className="tiny-green">↗ {progress}%</span> of all tasks</div></div>
          <div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon blue"><Clock3 size={18}/></span></div><div className="stat-value">{stats.pending}</div><div className="stat-foot">One step at a time</div></div>
          <div className="stat-card"><div className="stat-top"><span>Overdue</span><span className="stat-icon orange"><AlertCircle size={18}/></span></div><div className="stat-value">{stats.overdue}</div><div className="stat-foot">{stats.overdue ? "Needs your attention" : "You're all caught up"}</div></div>
        </section>
        <section className="tasks-section">
          <div className="section-heading"><div><h2>{filter === "all" ? "Your tasks" : `${filter[0].toUpperCase()+filter.slice(1)} tasks`} <span className="heading-count">{tasks.length}</span></h2><p>Keep your priorities close.</p></div>
            <div className="task-tools"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…"/></div><button className="secondary-btn filter-btn" onClick={()=>setFilter("all")}>All tasks <ChevronDown size={15}/></button></div>
          </div>
          <div className="task-list">
            {busy ? <div className="loading-state"><span className="spinner"/>Loading your tasks…</div> :
             tasks.length ? tasks.map(task=><TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={t=>setModal({...t, due_date:t.due_date || ""})} onDelete={deleteTask}/>) :
             <div className="empty-state"><div className="empty-icon"><CheckSquare size={24}/></div><h3>{search ? "No matching tasks" : "A fresh start"}</h3><p>{search ? "Try another search term." : "Your list is clear. Add a task to get the ball rolling."}</p>{!search && <button className="primary-btn" onClick={()=>setModal({})}><Plus size={17}/> Create your first task</button>}</div>}
          </div>
          <div className="list-footer"><span>Showing {tasks.length} task{tasks.length===1?"":"s"}</span><span><span className="live-dot"/> Synced with your workspace</span></div>
        </section>
        <footer className="page-footer">Made for focus, built for progress. <span>✦</span></footer>
      </div>
    </main>
    {modal && <TaskModal initial={modal.id ? modal : null} onClose={()=>setModal(null)} onSave={saveTask}/>}
  </div>;
}
