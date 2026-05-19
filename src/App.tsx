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
  sanitizeStorageFileName,
  sendMessage,
  uploadClientDocument,
  validateClientDocumentFile,
} from './firebase';
import type { Artwork, AuditEvent, DocumentItem, Message, PortalUser, Role } from './types';
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
  approvedRequests: string[];
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
    approvedRequests: [],
  };
  if (firebaseEnabled || typeof window === 'undefined') return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '') as Partial<PersistedPortalState>;
    return {
      messages: parsed.messages?.length ? parsed.messages : seedMessages,
      documents: parsed.documents?.length ? parsed.documents : seedDocuments,
      auditEvents: parsed.auditEvents?.length ? parsed.auditEvents : seedAudit,
      completedActions: parsed.completedActions ?? [],
      approvedRequests: parsed.approvedRequests ?? [],
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
    ['Collection Advisory', 'Strategic guidance on building and refining collections — market analysis, artist evaluation, provenance research, pricing intelligence, and negotiation.'],
    ['Collection Management', 'Institutional-grade oversight: cataloguing, condition reporting, insurance review, storage coordination, loan facilitation, and installation planning.'],
    ['Estate & Collection Transitions', 'Sensitive planning for succession, charitable placement, multigenerational governance, equitable distribution, and deaccession strategy.'],
    ['Art Investment Strategy', 'Disciplined analysis of art as an asset class, portfolio positioning, market trend review, and liquidity planning.'],
    ['Sales & Deaccession', 'Private treaty, auction, and dealer-channel execution designed to maximize value while preserving relationships and reputation.'],
    ['Art-Secured Lending', 'Appraisal coordination, loan structuring, and relationship management with specialty lenders and private banks.'],
    ['Artist & Estate Advisory', 'Legacy planning, archive management, catalogue raisonné support, market stewardship, and reputation strategy for artists and estates.'],
  ];
  const timeline = [
    ['1883', 'The House of Bultman', 'A. Frederick Bultman Sr. establishes the House of Bultman in New Orleans, beginning a family legacy of service, culture, and civic stewardship.'],
    ['1940s–50s', 'Artists, writers, patrons', 'The Bultman home becomes a gathering place for artists and cultural figures, shaping a family tradition of direct engagement with creative lives.'],
    ['1919–1985', 'Fritz Bultman', 'Fritz Bultman emerges as a significant Abstract Expressionist and art advisor, placing the family at the center of American modernism.'],
    ['2016', 'Bultman Advisory Founded', 'Tristan Bultman formalizes the advisory practice, uniting art-world relationships with institutional-grade strategic counsel.'],
  ];
  const team = [
    ['Tristan Bultman', 'Founder & Managing Partner', 'Fifth generation in the arts, with more than 15 years of art-world experience and a prior career in institutional finance.'],
    ['Leigh Mozes', 'Director of Collections', 'Sixteen years across galleries, auction houses, artist studios, installations, and private collection management.'],
  ];
  const insights = [
    ['The collection is the institution', 'Why serious private collections need the same operating discipline as museums, foundations, and family offices.'],
    ['Stewardship before transaction', 'The difference between advisory that chases volume and advisory that protects the work, the client, and the legacy.'],
    ['Documentation is risk management', 'How provenance, condition, insurance, ownership, and audit trails become the infrastructure of long-term value.'],
  ];

  return (
    <main className="site-shell">
      <nav className="site-nav">
        <a className="wordmark" href="#top"><span>BA</span><strong>Bultman Advisory</strong><em>Art · Legacy · Stewardship</em></a>
        <div>
          <a href="#about">About</a>
          <a href="#legacy">Legacy</a>
          <a href="#services">Services</a>
          <a href="#team">Team</a>
          <a href="#platform">Portal</a>
          <a href="#services" className="mobile-menu-link">☰ Menu</a>
          <button onClick={onEnter}>Client Portal</button>
        </div>
      </nav>

      <section id="top" className="hero-site hero-editorial">
        <div className="hero-editorial-grid">
          <div className="hero-copy-block">
            <p className="eyebrow">Private art advisory</p>
            <h1 className="controlled-headline"><span>Stewardship for</span><span>important collections</span></h1>
            <p className="hero-lede">
              Strategic counsel for collectors, families, estates, artists, and institutions where provenance, discretion, market discipline, and legacy matter.
            </p>
            <div className="hero-actions">
              <a href="#services" className="text-link">View advisory services</a>
              <button onClick={onEnter}>Private client portal <ArrowRight size={17}/></button>
            </div>
          </div>
          <aside className="art-dossier" aria-label="Private advisory dossier">
            <div className="art-dossier-image"><img src={`${import.meta.env.BASE_URL}bultman-advisory-editorial-hero.jpg`} alt="Private art advisory study with artwork and provenance dossier" /></div>
            <div className="art-dossier-copy">
              <span>Advisory dossier</span>
              <h2>Collection strategy, provenance review, estate transition, and market execution.</h2>
              <p>Built for collections that require museum-level discipline and private-office discretion.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="about" className="editorial-section intro-section">
        <div className="section-kicker">About</div>
        <div className="editorial-copy">
          <h2>A Different Kind<br/>of Advisory</h2>
          <p>
Bultman Advisory works where art, capital, family, and legacy intersect. The mandate is not to decorate a collection with advice — it is to protect meaning, value, provenance, and optionality over decades.
          </p>
          <p>
The firm brings institutional diligence to private collections: acquisition strategy, market intelligence, documentation, conservation coordination, insurance review, lending support, estate planning, and discreet sales execution.
          </p>
        </div>
      </section>

      <section className="metrics-band">
        <article><strong>1883</strong><span>House of Bultman Est.</span></article>
        <article><strong>5</strong><span>Generations in the Arts</span></article>
        <article><strong>2016</strong><span>Advisory Founded</span></article>
        <article><strong>15+</strong><span>Years in the Art World</span></article>
      </section>

      <section className="quote-band">
        <blockquote>“The work comes first. The market is only one part of stewardship.”</blockquote>
        <span>Tristan Bultman, Founder</span>
      </section>

      <section className="authority-band">
        <article><span>Private collectors</span><p>Acquisition theses, artist evaluation, valuation review, provenance files, conservation priorities, storage, insurance, and governance.</p></article>
        <article><span>Families & estates</span><p>Succession planning, equitable distribution, charitable placement, tax-aware disposition strategy, and family alignment.</p></article>
        <article><span>Artists & institutions</span><p>Archive structure, catalogue raisonné support, museum placement strategy, estate planning, and long-term reputation stewardship.</p></article>
      </section>

      <section id="legacy" className="editorial-section legacy-section">
        <div className="section-kicker">Legacy</div>
        <div className="editorial-copy">
          <h2>Five Generations of Stewardship</h2>
          <p>
            The Bultman family’s relationship with art spans more than 140 years — from the founding of the House of Bultman in New Orleans to the forefront of American Abstract Expressionism to the advisory practice of today.
          </p>
        </div>
        <div className="timeline-list">
          {timeline.map(([era, title, copy]) => (
            <article key={title}>
              <span>{era}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="section-kicker">Services</div>
        <h2>Institutional counsel for every chapter of a collection.</h2>
        <div className="service-list">
          {services.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="team-section">
        <div className="section-kicker">Team</div>
        <h2>Experienced counsel. Long-term alignment.</h2>
        <div className="team-grid">
          {team.map(([name, title, copy]) => (
            <article key={name}>
              <div className="portrait-placeholder">{name.split(' ').map((part) => part[0]).join('')}</div>
              <h3>{name}</h3>
              <span>{title}</span>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="platform" className="platform-section">
        <div>
          <div className="section-kicker">Client Platform</div>
          <h2>Private infrastructure for collection stewardship.</h2>
          <p>
            The client portal prototype translates the firm’s advisory discipline into a secure operating layer: role-based access, collection inventory, documents, messaging, action items, market notes, and audit history.
          </p>
          <div className="portal-trust">
            <span><LockKeyhole size={15}/> Private client access</span>
            <span><ShieldCheck size={15}/> Role-based permissions</span>
            <span><FileText size={15}/> Documents + audit trail</span>
          </div>
          <button onClick={onEnter}>Open the working portal</button>
        </div>
        <div className="portal-preview">
          <div className="preview-bar"><span></span><span></span><span></span></div>
          <p className="eyebrow">Stewardship Queue</p>
          <h3>Whitfield Family Collection</h3>
          <ul>
            <li><CheckCircle2 size={17}/> Insurance schedule review</li>
            <li><FileText size={17}/> Provenance packet pending</li>
            <li><MessageSquare size={17}/> Advisor market memo</li>
          </ul>
        </div>
      </section>

      <section id="insights" className="insights-section">
        <div className="section-kicker">Insights</div>
        <h2>Notes on art, markets, and stewardship.</h2>
        <div className="insight-grid">
          {insights.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#top">Read brief <ArrowRight size={14}/></a>
            </article>
          ))}
        </div>
      </section>

      <section className="careers-section">
        <div>
          <div className="section-kicker">Careers</div>
          <h2>Build the Future<br/>of Art Advisory</h2>
        </div>
        <p>
          Bultman Advisory is building institutional-caliber infrastructure for collectors, artists, families, and institutions. The portal is designed to support a practice defined by expertise, discretion, technology, and long-term stewardship.
        </p>
      </section>
    </main>
  );
}

function PortalLogin({ onLogin }: { onLogin: (user: PortalUser) => void }) {
  const [loginEmail, setLoginEmail] = useState('client@example.com');
  const [password, setPassword] = useState('prototype-only');
  const [activeRole, setActiveRole] = useState<Role>('Client');
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const selectedUser = useMemo(() => demoUsers.find((item) => item.role === activeRole) ?? demoUsers[2], [activeRole]);

  async function login() {
    const email = loginEmail.trim();
    if (!email || !password) {
      setLoginError('Enter an email and password to continue.');
      setLoginBusy(false);
      return;
    }
    setLoginError('');
    setLoginBusy(true);
    if (firebaseEnabled && password !== 'prototype-only') {
      try {
        const credential = await firebaseEmailLogin(email, password);
        onLogin({
          uid: credential.user.uid,
          email: credential.user.email ?? email,
          displayName: credential.user.displayName ?? email,
          role: activeRole,
          clientId: activeRole === 'Client' ? 'whitfield' : undefined,
        });
        return;
      } catch (error) {
        console.warn(error);
        setLoginError('We could not verify those credentials. Please check the email and password, or use prototype access for the demo workspace.');
        setLoginBusy(false);
        return;
      }
    }
    onLogin({ ...selectedUser, email: email || selectedUser.email });
  }

  async function googleLogin() {
    setLoginError('');
    setLoginBusy(true);
    if (!firebaseEnabled) return login();
    try {
      const credential = await firebaseGoogleLogin();
      onLogin({
        uid: credential.user.uid,
        email: credential.user.email ?? selectedUser.email,
        displayName: credential.user.displayName ?? selectedUser.displayName,
        role: activeRole,
        clientId: activeRole === 'Client' ? 'whitfield' : undefined,
      });
    } catch (error) {
      console.warn(error);
      setLoginError('Google sign-in was not completed. Please try again or enter your client credentials.');
      setLoginBusy(false);
    }
  }

  return (
    <main className="login-shell login-shell-private">
      <section className="login-panel" aria-label="Bultman Advisory private client portal">
        <aside className="login-editorial-card">
          <p className="eyebrow">Private Client Portal</p>
          <h1>Bultman Advisory</h1>
          <p className="login-copy">Secure access to collection records, documents, messages, and advisory updates.</p>
          <div className="login-trust-list" aria-label="Portal safeguards">
            <span><LockKeyhole size={16}/> Role-based access</span>
            <span><FileText size={16}/> Document audit trail</span>
            <span><ShieldCheck size={16}/> Private collection workspace</span>
          </div>
        </aside>

        <section className="login-card login-access-card" aria-labelledby="login-heading" aria-describedby="login-intro">
          <p className="eyebrow">Secure Access</p>
          <h2 id="login-heading">Enter the client workspace</h2>
          <p id="login-intro" className="login-copy login-card-copy">For clients, advisors, and approved collaborators.</p>

          <form className="login-form" aria-busy={loginBusy} onSubmit={(event) => { event.preventDefault(); void login(); }}>
            <label htmlFor="client-email">Email</label>
            <input id="client-email" type="email" autoComplete="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required aria-describedby="login-intro" />
            <label htmlFor="client-password">Password</label>
            <input id="client-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required aria-describedby="login-helper" />
            {loginError ? <p className="login-error" role="alert">{loginError}</p> : null}
            <button type="submit" disabled={loginBusy}>{loginBusy ? 'Opening workspace…' : 'Enter secure portal'}</button>
          </form>
          <button className="secondary" onClick={googleLogin} disabled={loginBusy}>Continue with Google</button>

          <fieldset className="demo-access-box" aria-describedby="login-helper">
            <legend>Demo controls</legend>
            <div className="status-pill"><ShieldCheck size={16}/> {firebaseEnabled ? 'Firebase auth available' : 'Demo workspace active'}</div>
            <label htmlFor="demo-access-level">Demo access level</label>
            <select id="demo-access-level" value={activeRole} onChange={(event) => setActiveRole(event.target.value as Role)}>{roles.map((role) => <option key={role}>{role}</option>)}</select>
            <p id="login-helper" className="fine-print">Prototype access uses <strong>prototype-only</strong>. {firebaseEnabled ? 'Real Firebase sessions remain available when configured.' : 'Demo messages, uploads, completed actions, and audit events persist in this browser until reset.'}</p>
          </fieldset>
        </section>
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
  const [approvedRequests, setApprovedRequests] = useState<string[]>(persisted.approvedRequests);
  const [collectionItems, setCollectionItems] = useState<Artwork[]>(artworks);
  const [draft, setDraft] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [portalNotice, setPortalNotice] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState<'none' | 'artwork' | 'users' | 'dossier'>('none');
  const [selectedArtworkId, setSelectedArtworkId] = useState(artworks[0]?.id ?? '');

  useEffect(() => {
    if (!firebaseEnabled && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, documents, auditEvents, completedActions, approvedRequests }));
    }
  }, [messages, documents, auditEvents, completedActions, approvedRequests]);

  const access = roleAccess(user?.role ?? 'Client');
  const visibleArt = collectionItems.filter((art) => !user?.clientId || art.clientId === user.clientId);
  const totalValue = visibleArt.reduce((sum, art) => sum + art.valuation, 0);
  const selectedArtwork = visibleArt.find((art) => art.id === selectedArtworkId) ?? visibleArt[0];
  const selectedArtworkDocuments = selectedArtwork ? documents.filter((doc) => doc.artworkId === selectedArtwork.id) : [];
  const stewardshipRisks = [
    ['Insurance renewal', 'High', 'Refresh valuation packet before June renewal.'],
    ['Condition photography', 'Medium', 'Storage images pending advisor review.'],
    ['Family governance', 'Medium', 'Prepare Mitchell packet for next week.'],
  ];
  const actionItems = [
    'Update insurance schedule before June renewal',
    'Approve Gilliam condition photography request',
    'Prepare Mitchell loan return inspection packet',
  ];
  const approvalRequests = [
    { id: 'approval-insurance', title: 'Release refreshed insurance schedule', requester: 'Leigh Mozes', due: 'May 24', scope: 'Share updated valuation packet with carrier and family office.' },
    { id: 'approval-conservation', title: 'Authorize condition photography', requester: 'Tristan Bultman', due: 'May 27', scope: 'Approve storage facility photography for the Gilliam stretcher concern.' },
    { id: 'approval-governance', title: 'Prepare family governance packet', requester: 'Leigh Mozes', due: 'May 30', scope: 'Include Mitchell works on paper, loan return notes, and estate transition memo.' },
  ];
  const openActions = actionItems.filter((item) => !completedActions.includes(item));
  const pendingApprovals = approvalRequests.filter((item) => !approvedRequests.includes(item.id));

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
    const validationError = validateClientDocumentFile(file);
    if (validationError) {
      setUploadStatus(validationError);
      return;
    }
    const safeName = sanitizeStorageFileName(file.name);
    setUploadStatus(`Uploading ${safeName}…`);
    const doc: DocumentItem = {
      id: `doc-${Date.now()}`,
      clientId: 'whitfield',
      name: safeName,
      category: 'Condition Report',
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      updatedAt: new Date().toISOString().slice(0, 10),
      storagePath: `clients/whitfield/${safeName}`,
    };
    try {
      if (firebaseEnabled) await uploadClientDocument('whitfield', file, user.displayName);
      setDocuments((current) => [doc, ...current]);
      appendAudit(user.displayName, 'Uploaded document', safeName);
      await new Promise((resolve) => setTimeout(resolve, 450));
      setUploadStatus(`${safeName} uploaded and audit logged.`);
    } catch (error) {
      setUploadStatus(`${safeName} upload failed; no document record was saved.`);
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
    setApprovedRequests([]);
    setCollectionItems(artworks);
    setUploadStatus('');
    setPortalNotice('Demo data reset.');
    setActiveWorkspace('none');
    setSelectedArtworkId(artworks[0]?.id ?? '');
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }

  function addPrototypeArtwork() {
    if (!user || !access.canEdit) return;
    const next: Artwork = {
      id: `art-${Date.now()}`,
      clientId: 'whitfield',
      artist: 'Alma Thomas',
      title: 'Color Field Study',
      year: '1972',
      medium: 'Acrylic on paper',
      dimensions: '24 × 30 in',
      location: 'Advisor review queue',
      status: 'Under Review',
      valuation: 310000,
      imageUrl: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1400&q=80',
      provenance: 'Prototype intake record pending advisor diligence.',
      nextAction: 'Create provenance checklist and condition photography request.',
    };
    setCollectionItems((current) => [next, ...current]);
    setPortalNotice('Prototype artwork intake added to the collection queue.');
    setSelectedArtworkId(next.id);
    setActiveWorkspace('artwork');
    appendAudit(user.displayName, 'Added artwork intake', next.title);
  }

  function openArtworkDossier(artwork: Artwork) {
    if (!user) return;
    setSelectedArtworkId(artwork.id);
    setActiveWorkspace('dossier');
    setPortalNotice(`${artwork.artist} dossier opened.`);
    appendAudit(user.displayName, 'Opened artwork dossier', artwork.title);
  }

  function approveRequest(requestId: string) {
    if (!user || approvedRequests.includes(requestId) || !access.canFinancials) return;
    const request = approvalRequests.find((item) => item.id === requestId);
    setApprovedRequests((current) => [...current, requestId]);
    setPortalNotice(`${request?.title ?? 'Approval request'} approved and audit logged.`);
    appendAudit(user.displayName, 'Approved stewardship request', request?.title ?? requestId);
  }

  function openUserManagement() {
    if (!user || !access.canUsers) return;
    setActiveWorkspace('users');
    setPortalNotice('User management workspace opened.');
    appendAudit(user.displayName, 'Opened user management', 'Portal access roster');
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
          <a href="#approvals"><CheckCircle2 size={18}/> Approvals</a>
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
        {portalNotice && <div className="portal-notice" role="status"><CheckCircle2 size={18}/>{portalNotice}</div>}

        <section id="dashboard" className="grid stats">
          <article><span>Total collection value</span><strong>{access.canFinancials ? currency.format(totalValue) : 'Restricted'}</strong><small>Across {visibleArt.length} catalogued works</small></article>
          <article><span>Documents</span><strong>{documents.length}</strong><small>Insurance, provenance, reports</small></article>
          <article><span>Open actions</span><strong>{openActions.length}</strong><small>{completedActions.length} completed this session</small></article>
          <article><span>Pending approvals</span><strong>{pendingApprovals.length}</strong><small>{approvedRequests.length} approved this session</small></article>
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
          <div className="section-head"><div><p className="eyebrow">Collection Inventory</p><h2>Works requiring stewardship</h2></div>{access.canEdit && <button onClick={addPrototypeArtwork}>+ Add artwork</button>}</div>
          <div className="art-grid">
            {visibleArt.map((art) => (
              <article className="art-card" key={art.id}>
                <img src={art.imageUrl} alt={`${art.artist} ${art.title}`} />
                <div><span>{art.status}</span><h3>{art.artist}</h3><p><em>{art.title}</em>, {art.year}</p><p>{art.medium} · {art.dimensions}</p><strong>{access.canFinancials ? currency.format(art.valuation) : 'Valuation restricted'}</strong><small>{art.nextAction}</small><button className="secondary mini card-action" onClick={() => openArtworkDossier(art)}>Open dossier</button></div>
              </article>
            ))}
          </div>
        </section>


        {activeWorkspace === 'artwork' && access.canEdit && (
          <section className="panel workspace-panel" aria-label="Artwork intake workspace">
            <div className="section-head"><div><p className="eyebrow">Artwork Intake</p><h2>New work added to review queue</h2></div><button className="secondary mini" onClick={() => setActiveWorkspace('none')}>Close</button></div>
            <p>The prototype intake created an under-review artwork record, logged the action, and moved it to the top of the collection inventory.</p>
            <div className="row"><Archive size={18}/><div><strong>Next step</strong><span>Create provenance checklist and assign condition photography.</span></div></div>
          </section>
        )}

        {activeWorkspace === 'dossier' && selectedArtwork && (
          <section className="panel workspace-panel dossier-panel" aria-label="Artwork stewardship dossier">
            <div className="section-head"><div><p className="eyebrow">Artwork Dossier</p><h2>{selectedArtwork.artist}</h2></div><button className="secondary mini" onClick={() => setActiveWorkspace('none')}>Close</button></div>
            <div className="dossier-grid">
              <img src={selectedArtwork.imageUrl} alt={`${selectedArtwork.artist} ${selectedArtwork.title}`} />
              <div className="dossier-details">
                <span className="status-pill">{selectedArtwork.status}</span>
                <h3><em>{selectedArtwork.title}</em>, {selectedArtwork.year}</h3>
                <dl>
                  <div><dt>Medium</dt><dd>{selectedArtwork.medium}</dd></div>
                  <div><dt>Dimensions</dt><dd>{selectedArtwork.dimensions}</dd></div>
                  <div><dt>Location</dt><dd>{selectedArtwork.location}</dd></div>
                  <div><dt>Valuation</dt><dd>{access.canFinancials ? currency.format(selectedArtwork.valuation) : 'Restricted'}</dd></div>
                </dl>
                <p>{selectedArtwork.provenance}</p>
              </div>
            </div>
            <div className="dossier-columns">
              <div>
                <h3>Related documents</h3>
                {selectedArtworkDocuments.length ? selectedArtworkDocuments.map((doc) => <div className="row compact-row" key={doc.id}><FileText size={18}/><div><strong>{doc.name}</strong><span>{doc.category} · {doc.updatedAt}</span></div></div>) : <p className="fine-print">No attached documents yet.</p>}
              </div>
              <div>
                <h3>Risk queue</h3>
                {stewardshipRisks.map(([name, level, copy]) => <div className="row compact-row" key={name}><ShieldCheck size={18}/><div><strong>{name} · {level}</strong><span>{copy}</span></div></div>)}
              </div>
            </div>
          </section>
        )}

        {activeWorkspace === 'users' && access.canUsers && (
          <section className="panel workspace-panel" aria-label="User management workspace">
            <div className="section-head"><div><p className="eyebrow">User Management</p><h2>Portal access roster</h2></div><button className="secondary mini" onClick={() => setActiveWorkspace('none')}>Close</button></div>
            {demoUsers.map((member) => <div className="row" key={member.uid}><Users size={18}/><div><strong>{member.displayName}</strong><span>{member.role} · {member.email}</span></div></div>)}
            <div className="row"><ShieldCheck size={18}/><div><strong>Permission model</strong><span>Owner controls user access; Advisor manages collection records; Client sees approved financials and documents.</span></div></div>
          </section>
        )}

        <section id="approvals" className="panel approval-panel">
          <div className="section-head"><div><p className="eyebrow">Client Approvals</p><h2>Decision queue</h2></div><span className="status-pill">{pendingApprovals.length} pending</span></div>
          <div className="approval-grid">
            {approvalRequests.map((request) => {
              const approved = approvedRequests.includes(request.id);
              return <article className={approved ? 'approval-card approved' : 'approval-card'} key={request.id}>
                <span>{approved ? 'Approved' : `Due ${request.due}`}</span>
                <h3>{request.title}</h3>
                <p>{request.scope}</p>
                <small>Requested by {request.requester}</small>
                <button className="secondary mini" disabled={approved || !access.canFinancials} onClick={() => approveRequest(request.id)}>{approved ? 'Approved' : 'Approve'}</button>
              </article>;
            })}
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
          <div className="section-head"><div><p className="eyebrow">Audit & Compliance</p><h2>Immutable activity log</h2></div>{access.canUsers && <button className="secondary" onClick={openUserManagement}><Users size={16}/> Manage users</button>}</div>
          {access.canAudit ? auditEvents.map((event) => <div className="row" key={event.id}><ShieldCheck size={18}/><div><strong>{event.action}</strong><span>{event.actor} · {event.target} · {event.createdAt}</span></div></div>) : <p className="restricted">Audit log is restricted to Owner and Advisor roles.</p>}
        </section>
      </section>
    </main>
  );
}
