import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  ArrowRight,
  Bell,
  CheckCircle2,
  FileText,
  Landmark,
  LockKeyhole,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react';
import {
  auditEvents as seedAudit,
  artworks,
  demoUsers,
  documents as seedDocuments,
  marketUpdates,
  messages as seedMessages,
} from './demoData';
import {
  firebaseEnabled,
  firebaseEmailLogin,
  firebaseGoogleLogin,
  firebaseLogout,
  sendMessage,
  uploadClientDocument,
} from './firebase';
import type { AuditEvent, DocumentItem, Message, PortalUser, Role } from './types';
import './style.css';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const roles: Role[] = ['Owner', 'Advisor', 'Associate', 'Client', 'External Collaborator'];
const STORAGE_KEY = 'bultman-portal-prototype-state-v4';

interface PersistedPortalState {
  messages: Message[];
  documents: DocumentItem[];
  auditEvents: AuditEvent[];
  completedActions: string[];
}

function roleAccess(role: Role) {
  return {
    canEdit: role === 'Owner' || role === 'Advisor',
    canFinancials: role === 'Owner' || role === 'Advisor' || role === 'Client',
    canAudit: role === 'Owner' || role === 'Advisor',
    canUsers: role === 'Owner',
  };
}

function initialState(): PersistedPortalState {
  const fallback = {
    messages: seedMessages,
    documents: seedDocuments,
    auditEvents: seedAudit,
    completedActions: [],
  };
  if (firebaseEnabled || typeof window === 'undefined') return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '') as Partial<PersistedPortalState>;
    return {
      messages: parsed.messages?.length ? parsed.messages : seedMessages,
      documents: parsed.documents?.length ? parsed.documents : seedDocuments,
      auditEvents: parsed.auditEvents?.length ? parsed.auditEvents : seedAudit,
      completedActions: parsed.completedActions ?? [],
    };
  } catch {
    return fallback;
  }
}

function timestamp() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

function PublicSite({ onEnter }: { onEnter: () => void }) {
  const services = [
    ['Collection Advisory', 'Acquisition strategy, artist evaluation, pricing intelligence, diligence, and negotiation support.'],
    ['Collection Management', 'Cataloguing, condition tracking, insurance review, storage coordination, and installation oversight.'],
    ['Estate & Transitions', 'Succession planning, collection governance, family education, and charitable placement strategy.'],
    ['Art Investment Strategy', 'Portfolio-level market analysis, liquidity planning, risk review, and long-term positioning.'],
    ['Sales & Deaccession', 'Private treaty, auction, and dealer-channel execution with discretion and relationship control.'],
    ['Artist Estate Advisory', 'Legacy planning, archive management, catalogue raisonné support, and market stewardship.'],
  ];
  const insights = [
    ['Market discipline over market noise', 'How institutional collectors separate signal from auction-cycle volatility.'],
    ['Documentation is stewardship', 'Why condition, provenance, insurance, and ownership records are the real collection infrastructure.'],
    ['Estate planning before urgency', 'The governance decisions that preserve family alignment before transition pressure arrives.'],
  ];

  return (
    <main className="site-shell">
      <nav className="site-nav">
        <a className="wordmark" href="#top"><span>BA</span>Bultman Advisory</a>
        <div>
          <a href="#services">Services</a>
          <a href="#platform">Portal</a>
          <a href="#legacy">Legacy</a>
          <a href="#insights">Insights</a>
          <button onClick={onEnter}>Client Login</button>
        </div>
      </nav>

      <section id="top" className="hero-site">
        <div className="hero-copy">
          <p className="eyebrow">Art · Legacy · Stewardship</p>
          <h1>Institutional-caliber advisory for collections that must endure.</h1>
          <p>
            Bultman Advisory brings rigorous collection management, estate transition planning,
            market intelligence, and secure client collaboration into one discreet digital portal.
          </p>
          <div className="hero-actions">
            <button onClick={onEnter}>Enter client portal <ArrowRight size={18}/></button>
            <a href="#platform">View platform</a>
          </div>
        </div>
        <div className="hero-panel">
          <span>Private collection dashboard</span>
          <strong>Portfolio view</strong>
          <small>Inventory · documents · messages · stewardship actions</small>
          <div className="mini-stack">
            <b>Insurance schedule review</b>
            <b>Loan inspection workflow</b>
            <b>Advisor market memo</b>
          </div>
        </div>
      </section>

      <section className="cred-strip">
        <article><strong>1883</strong><span>House of Bultman established</span></article>
        <article><strong>5</strong><span>Generations in the arts</span></article>
        <article><strong>2016</strong><span>Advisory founded</span></article>
        <article><strong>15+</strong><span>Years of art-world experience</span></article>
      </section>

      <section id="services" className="site-section">
        <p className="eyebrow">Services</p>
        <h2>A private office for the life of a collection.</h2>
        <div className="service-grid">
          {services.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="platform" className="site-section platform-band">
        <div>
          <p className="eyebrow">Client Portal</p>
          <h2>Secure access to the collection, documents, messages, reports, and audit trail.</h2>
          <p>
            The prototype includes role-based views, client-scoped inventory, secure document flows,
            advisor messaging, action tracking, market updates, and an immutable activity log.
          </p>
          <button onClick={onEnter}>Open working prototype</button>
        </div>
        <div className="screen-card">
          <div className="screen-top"><span></span><span></span><span></span></div>
          <h3>Stewardship Queue</h3>
          <p>Approve condition photography request</p>
          <p>Prepare loan return inspection packet</p>
          <p>Update insurance schedule before renewal</p>
        </div>
      </section>

      <section id="legacy" className="site-section legacy-grid">
        <div>
          <p className="eyebrow">Legacy</p>
          <h2>Five generations of stewardship, translated for modern collectors.</h2>
        </div>
        <blockquote>
          “Art is not a decoration. It is a heritage, a responsibility, and — when properly cared for — a legacy that outlasts us all.”
        </blockquote>
      </section>

      <section id="insights" className="site-section insights">
        <p className="eyebrow">Insights</p>
        <h2>Strategic notes for collectors, families, and institutions.</h2>
        <div className="insight-grid">
          {insights.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#top">Read brief <ArrowRight size={15}/></a>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section contact-band">
        <p className="eyebrow">Private Access</p>
        <h2>Designed for discreet, high-trust collection stewardship.</h2>
        <p>Client portal access is invitation-only. The working prototype is available through the secure login flow.</p>
        <button onClick={onEnter}>Enter portal</button>
      </section>
    </main>
  );
}

function PortalLogin({ onLogin }: { onLogin: (user: PortalUser) => void }) {
  const [loginEmail, setLoginEmail] = useState('client@example.com');
  const [password, setPassword] = useState('prototype-only');
  const [activeRole, setActiveRole] = useState<Role>('Client');
  const selectedUser = useMemo(() => demoUsers.find((item) => item.role === activeRole) ?? demoUsers[2], [activeRole]);

  async function login() {
    if (firebaseEnabled && password !== 'prototype-only') {
      try {
        const credential = await firebaseEmailLogin(loginEmail, password);
        onLogin({
          uid: credential.user.uid,
          email: credential.user.email ?? loginEmail,
          displayName: credential.user.displayName ?? loginEmail,
          role: activeRole,
          clientId: activeRole === 'Client' ? 'whitfield' : undefined,
        });
        return;
      } catch (error) {
        console.warn(error);
      }
    }
    onLogin({ ...selectedUser, email: loginEmail || selectedUser.email });
  }

  async function googleLogin() {
    if (!firebaseEnabled) return login();
    const credential = await firebaseGoogleLogin();
    onLogin({
      uid: credential.user.uid,
      email: credential.user.email ?? selectedUser.email,
      displayName: credential.user.displayName ?? selectedUser.displayName,
      role: activeRole,
      clientId: activeRole === 'Client' ? 'whitfield' : undefined,
    });
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <p className="eyebrow">Bultman Advisory</p>
        <h1>Art · Legacy · Stewardship</h1>
        <p className="login-copy">Secure portal access for clients, advisors, and collaborators.</p>
        <div className="status-pill"><ShieldCheck size={16}/> {firebaseEnabled ? 'Firebase connected' : 'Working prototype mode'}</div>
        <label>Role preview<select value={activeRole} onChange={(event) => setActiveRole(event.target.value as Role)}>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
        <label>Email<input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button onClick={login}>Enter secure portal</button>
        <button className="secondary" onClick={googleLogin}>Continue with Google</button>
        <p className="fine-print">Demo password: <strong>prototype-only</strong>. {firebaseEnabled ? 'Firebase-connected demo sessions are in-memory unless real Auth/Firestore credentials are used.' : 'Messages, uploads, completed actions, and audit events persist in this browser until reset.'}</p>
      </section>
    </main>
  );
}

export default function App() {
  const persisted = useMemo(initialState, []);
  const [mode, setMode] = useState<'site' | 'login' | 'portal'>('site');
  const [user, setUser] = useState<PortalUser | null>(null);
  const [messages, setMessages] = useState<Message[]>(persisted.messages);
  const [documents, setDocuments] = useState<DocumentItem[]>(persisted.documents);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(persisted.auditEvents);
  const [completedActions, setCompletedActions] = useState<string[]>(persisted.completedActions);
  const [draft, setDraft] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (!firebaseEnabled && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, documents, auditEvents, completedActions }));
    }
  }, [messages, documents, auditEvents, completedActions]);

  const access = roleAccess(user?.role ?? 'Client');
  const visibleArt = artworks.filter((art) => !user?.clientId || art.clientId === user.clientId);
  const totalValue = visibleArt.reduce((sum, art) => sum + art.valuation, 0);
  const actionItems = [
    'Update insurance schedule before June renewal',
    'Approve Gilliam condition photography request',
    'Prepare Mitchell loan return inspection packet',
  ];
  const openActions = actionItems.filter((item) => !completedActions.includes(item));

  function appendAudit(actor: string, action: string, target: string) {
    setAuditEvents((current) => [{ id: `audit-${Date.now()}`, actor, action, target, createdAt: timestamp() }, ...current]);
  }

  function onLogin(next: PortalUser) {
    setUser(next);
    setMode('portal');
    appendAudit(next.displayName, 'Logged in', `${next.role} session`);
  }

  async function logout() {
    if (user) appendAudit(user.displayName, 'Signed out', 'Portal session');
    await firebaseLogout();
    if (firebaseEnabled && typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setMode('site');
  }

  async function submitMessage() {
    if (!draft.trim() || !user) return;
    const next = { id: `msg-${Date.now()}`, clientId: 'whitfield', from: user.displayName, role: user.role, body: draft.trim(), createdAt: timestamp() };
    setMessages((current) => [next, ...current]);
    setDraft('');
    appendAudit(user.displayName, 'Sent message', 'Whitfield Family Collection');
    if (firebaseEnabled) await sendMessage('whitfield', user.displayName, user.role, next.body);
  }

  async function handleUpload(file?: File) {
    if (!file || !user) return;
    if (firebaseEnabled && !access.canEdit) {
      setUploadStatus('Upload requires Owner or Advisor access.');
      return;
    }
    setUploadStatus(`Uploading ${file.name}…`);
    const doc: DocumentItem = {
      id: `doc-${Date.now()}`,
      clientId: 'whitfield',
      name: file.name,
      category: 'Condition Report',
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      updatedAt: new Date().toISOString().slice(0, 10),
      storagePath: `clients/whitfield/${file.name}`,
    };
    try {
      if (firebaseEnabled) await uploadClientDocument('whitfield', file);
      setDocuments((current) => [doc, ...current]);
      appendAudit(user.displayName, 'Uploaded document', file.name);
      await new Promise((resolve) => setTimeout(resolve, 450));
      setUploadStatus(`${file.name} uploaded and audit logged.`);
    } catch (error) {
      setUploadStatus(`${file.name} upload failed; no document record was saved.`);
      console.warn(error);
    }
  }

  function completeAction(action: string) {
    if (!user || completedActions.includes(action)) return;
    setCompletedActions((current) => [...current, action]);
    appendAudit(user.displayName, 'Completed action item', action);
  }

  function resetDemo() {
    setMessages(seedMessages);
    setDocuments(seedDocuments);
    setAuditEvents(seedAudit);
    setCompletedActions([]);
    setUploadStatus('Demo data reset.');
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }

  if (mode === 'site') return <PublicSite onEnter={() => setMode('login')} />;
  if (mode === 'login' || !user) return <PortalLogin onLogin={onLogin} />;

  return (
    <main className="portal-shell">
      <aside className="sidebar">
        <div className="brand-mark">BA</div>
        <p className="eyebrow">Bultman Advisory</p>
        <h2>Client Portal</h2>
        <nav>
          <a href="#dashboard"><Landmark size={18}/> Dashboard</a>
          <a href="#collection"><Archive size={18}/> Collection</a>
          <a href="#documents"><FileText size={18}/> Documents</a>
          <a href="#messages"><MessageSquare size={18}/> Messages</a>
          <a href="#audit"><ShieldCheck size={18}/> Audit</a>
        </nav>
        <button className="ghost" onClick={resetDemo}>Reset demo data</button>
        <button className="ghost" onClick={logout}><LogOut size={16}/> Sign out</button>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><p className="eyebrow">Welcome back</p><h1>{user.displayName}</h1><span>{user.role} access · Whitfield Family Collection</span></div>
          <div className="top-actions"><span><Bell size={16}/> {openActions.length} action items</span><span><LockKeyhole size={16}/> 2FA required for financial fields</span></div>
        </header>

        <section id="dashboard" className="grid stats">
          <article><span>Total collection value</span><strong>{access.canFinancials ? currency.format(totalValue) : 'Restricted'}</strong><small>Across {visibleArt.length} catalogued works</small></article>
          <article><span>Documents</span><strong>{documents.length}</strong><small>Insurance, provenance, reports</small></article>
          <article><span>Open actions</span><strong>{openActions.length}</strong><small>{completedActions.length} completed this session</small></article>
          <article><span>Security posture</span><strong>Elevated</strong><small>RLS, audit logs, Storage rules</small></article>
        </section>

        <section className="panel">
          <div className="section-head"><div><p className="eyebrow">Action Items</p><h2>Stewardship queue</h2></div></div>
          {actionItems.map((action) => (
            <div className="row" key={action}>
              <CheckCircle2 size={18}/>
              <div><strong className={completedActions.includes(action) ? 'done' : ''}>{action}</strong><span>{completedActions.includes(action) ? 'Completed and audit logged' : 'Awaiting advisor/client action'}</span></div>
              {!completedActions.includes(action) && <button className="secondary mini" onClick={() => completeAction(action)}>Mark done</button>}
            </div>
          ))}
        </section>

        <section id="collection" className="panel">
          <div className="section-head"><div><p className="eyebrow">Collection Inventory</p><h2>Works requiring stewardship</h2></div>{access.canEdit && <button>+ Add artwork</button>}</div>
          <div className="art-grid">
            {visibleArt.map((art) => (
              <article className="art-card" key={art.id}>
                <img src={art.imageUrl} alt={`${art.artist} ${art.title}`} />
                <div><span>{art.status}</span><h3>{art.artist}</h3><p><em>{art.title}</em>, {art.year}</p><p>{art.medium} · {art.dimensions}</p><strong>{access.canFinancials ? currency.format(art.valuation) : 'Valuation restricted'}</strong><small>{art.nextAction}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section id="documents" className="panel split">
          <div><p className="eyebrow">Documents & Storage</p><h2>Secure client files</h2>{documents.map((doc) => <div className="row" key={doc.id}><FileText size={18}/><div><strong>{doc.name}</strong><span>{doc.category} · {doc.size} · {doc.updatedAt}</span></div></div>)}</div>
          <label className="upload-box"><Upload size={28}/><strong>Upload document</strong><span>{firebaseEnabled ? 'Owner/Advisor uploads route to Firebase Storage.' : 'Demo uploads persist in this browser.'}</span><input type="file" disabled={firebaseEnabled && !access.canEdit} onChange={(event) => handleUpload(event.target.files?.[0])}/>{uploadStatus && <em>{uploadStatus}</em>}</label>
        </section>

        <section id="messages" className="panel split">
          <div><p className="eyebrow">Advisor Messaging</p><h2>Threaded communications</h2>{messages.map((message) => <div className="message" key={message.id}><strong>{message.from} <span>{message.role}</span></strong><p>{message.body}</p><small>{message.createdAt}</small></div>)}</div>
          <div className="composer"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a secure message…"/><button onClick={submitMessage}>Send message</button></div>
        </section>

        <section className="panel"><p className="eyebrow">Market Updates</p><h2>Advisor intelligence feed</h2><div className="updates">{marketUpdates.map((update) => <article key={update.id}><span>{update.tag}</span><h3>{update.title}</h3><p>{update.summary}</p><small>{update.publishedAt}</small></article>)}</div></section>

        <section id="audit" className="panel">
          <div className="section-head"><div><p className="eyebrow">Audit & Compliance</p><h2>Immutable activity log</h2></div>{access.canUsers && <button className="secondary"><Users size={16}/> Manage users</button>}</div>
          {access.canAudit ? auditEvents.map((event) => <div className="row" key={event.id}><ShieldCheck size={18}/><div><strong>{event.action}</strong><span>{event.actor} · {event.target} · {event.createdAt}</span></div></div>) : <p className="restricted">Audit log is restricted to Owner and Advisor roles.</p>}
        </section>
      </section>
    </main>
  );
}
