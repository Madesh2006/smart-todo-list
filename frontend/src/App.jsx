import { useState } from "react";
import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";
import { CheckSquare, Mail, LockKeyhole, UserRound, Sparkles } from "lucide-react";
import api from "./api";
import Dashboard from "./pages/Dashboard";

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("todo_token", data.access_token);
      localStorage.setItem("todo_user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not connect to the server. Check that the API is running.");
    } finally { setBusy(false); }
  }

  return <main className="auth-shell">
    <section className="auth-art">
      <div className="brand"><span className="brand-icon"><CheckSquare size={22}/></span> focus<span className="brand-dot">.</span></div>
      <div className="art-copy"><span className="eyebrow"><Sparkles size={14}/> YOUR SPACE TO GET THINGS DONE</span>
        <h1>Make room for<br/><span>what matters.</span></h1>
        <p>A calmer way to plan your day, focus on priorities, and celebrate progress.</p>
        <div className="mini-preview"><div className="preview-top"><span>Today’s focus</span><span className="preview-count">2 of 4</span></div>
          <div className="preview-task done"><span className="fake-check">✓</span><span>Review project notes</span></div>
          <div className="preview-task"><span className="fake-check"></span><span>Finish UI design</span><i className="priority-dot"/></div>
          <div className="preview-task"><span className="fake-check"></span><span>Plan tomorrow</span><i className="priority-dot low"/></div>
          <div className="progress-track"><span style={{width:"50%"}}/></div>
        </div>
      </div>
      <div className="art-foot">LESS CHAOS. MORE CLARITY.</div>
    </section>
    <section className="auth-panel"><div className="auth-form-wrap">
      <div className="mobile-brand brand"><span className="brand-icon"><CheckSquare size={22}/></span> focus<span className="brand-dot">.</span></div>
      <span className="eyebrow">WELCOME {isRegister ? "ABOARD" : "BACK"}</span>
      <h2>{isRegister ? "Create your account" : "Good to see you."}</h2>
      <p className="muted">{isRegister ? "Start turning your plans into progress." : "Sign in to pick up where you left off."}</p>
      <form onSubmit={submit} className="auth-form">
        {isRegister && <label>Full name<div className="input-wrap"><UserRound size={17}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" minLength="2" maxLength="100" required /></div></label>}
        <label>Email address<div className="input-wrap"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></div></label>
        <label>Password<div className="input-wrap"><LockKeyhole size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" minLength="8" maxLength="128" required /></div></label>
        {error && <div className="error-box">{String(error)}</div>}
        <button className="primary-btn full-btn" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <span>→</span></button>
      </form>
      <p className="auth-switch">{isRegister ? "Already have an account?" : "New to Focus?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
      <p className="fine-print">Your tasks, your pace. Built for better days.</p>
    </div></section>
  </main>;
}

function Protected() {
  return localStorage.getItem("todo_token") ? <Dashboard/> : <Navigate to="/login" replace/>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Protected/>}/>
    <Route path="/login" element={localStorage.getItem("todo_token") ? <Navigate to="/" replace/> : <AuthPage mode="login"/>}/>
    <Route path="/register" element={localStorage.getItem("todo_token") ? <Navigate to="/" replace/> : <AuthPage mode="register"/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
