import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Bookmark, CalendarDays,
  Check, ChevronDown, CircleDollarSign, Clock3, ExternalLink, Filter,
  FolderOpen, HeartHandshake, LayoutDashboard, Menu, Plus, Search,
  Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Target, Users, X, WandSparkles
} from 'lucide-react'

const initialGrants = [
  {
    id: 'tu-manawa', name: 'Tū Manawa Active Aotearoa', funder: 'Sport Waikato',
    category: 'Participation & inclusion', amount: 'Needs-based; confirm project budget with Sport Waikato', status: 'Open',
    deadline: 'Rolling applications: 1 Jul–30 Jun', region: 'Waikato', fit: 'Potential fit',
    description: 'Supports community-led play, active recreation and sport projects for tamariki and rangatahi aged 5–18, with priority for groups facing barriers to participation.',
    eligibility: 'Sport Waikato starts with a conversation and works with applicants on request. It prioritises eligible organisations including clubs, schools and community groups with legal status. Funding may support programme delivery, delivery staff, equipment, venue hire and transport that removes barriers. Ongoing admin costs, capital items and vehicles are not funded.',
    source: 'https://www.sportwaikato.org.nz/about/tu-manawa-active-aotearoa-fund',
    verified: '29 Oct 2026', saved: true, applicationStatus: 'Considering'
  },
  {
    id: 'rural-travel', name: 'Rural Travel Fund', funder: 'Sport New Zealand / local council',
    category: 'Travel & competition', amount: 'Ask your participating local council', status: 'Check with local council',
    deadline: 'Council-managed rounds; confirm locally', region: 'Eligible rural areas', fit: 'Eligibility-specific',
    description: 'Helps subsidise travel for eligible rural junior teams aged 5–18 to take part in regular local sporting competitions outside school time.',
    eligibility: 'Applications are made through participating territorial authorities, not directly to Sport NZ. Teams must be based in an eligible authority area and compete in regular local competition. It does not cover individuals, one-off national events, or school-time inter-school competitions. In the Waikato region, check the official list of participating councils before relying on eligibility.',
    source: 'https://sportnz.org.nz/resources/rural-travel-fund/',
    verified: '29 Oct 2026', saved: false, applicationStatus: 'Monitoring'
  },
  {
    id: 'hamilton-development-contribution', name: 'Development Contribution Fund', funder: 'Hamilton City Council',
    category: 'Facilities & development', amount: 'Up to $10,000 considered; $20,000 fund pool', status: 'Open',
    deadline: '30 Jun 2027', region: 'Hamilton', fit: 'Narrow project fit',
    description: 'A specific fund to help eligible not-for-profit community organisations offset development contribution charges for small-scale community developments in Hamilton.',
    eligibility: 'Only covers development contribution charges for qualifying small-scale developments, generally 30 m² or less. Applicants must be a legally constituted not-for-profit operating for at least 12 months and provide free or low-cost services benefiting Hamiltonians. It does not cover general equipment, coaching, or operating costs. Grants are not guaranteed.',
    source: 'https://hamilton.govt.nz/community-support-and-funding/community-funding/development-contribution-fund',
    verified: '29 Oct 2026', saved: false, applicationStatus: 'Not started'
  },
  {
    id: 'hamilton-welcoming-communities', name: 'Welcoming Communities Fund', funder: 'Hamilton City Council',
    category: 'Inclusion & connection', amount: 'Up to $5,000 per project; $75,000 fund pool', status: 'Open',
    deadline: '1 Jun 2027 or until funds are allocated', region: 'Hamilton', fit: 'Project-specific',
    description: 'Supports new projects and activities that help newcomers feel welcome, improve equitable access, and build connected and inclusive communities in Hamilton.',
    eligibility: 'Priority is given to new projects aligned with Hamilton’s Welcoming Plan. Applicants generally need to be a legally constituted not-for-profit that has operated for at least 12 months. Existing business-as-usual programmes and retrospective costs are not funded. A sports club should contact Council to confirm the project fits the fund’s newcomer and inclusion outcomes.',
    source: 'https://hamilton.govt.nz/community-support-and-funding/community-funding/welcoming-communities-fund',
    verified: '29 Oct 2026', saved: false, applicationStatus: 'Not started'
  },
  {
    id: 'trust-waikato', name: 'Community Response Grant', funder: 'Trust Waikato',
    category: 'Community wellbeing', amount: 'Check current grant guidelines', status: 'Check current round',
    deadline: 'Check official closing dates', region: 'Waikato region', fit: 'Potential fit',
    description: 'Trust Waikato funds for-purpose groups and initiatives that strengthen community vibrancy, quality of life, resilience, participation and inclusion, including sport and recreation.',
    eligibility: 'Groups generally need to operate mainly in the Waikato region or serve people in the region, have a bank account and annual financial statements, and have a charitable purpose. Trust Waikato runs three funding rounds each year; confirm the current dates and eligibility before preparing an application.',
    source: 'https://trustwaikato.co.nz/grants-funding/',
    verified: '29 Oct 2026', saved: false, applicationStatus: 'Monitoring'
  },
  {
    id: 'grassroots-trust', name: 'Community Grants', funder: 'Grassroots Trust',
    category: 'Equipment', amount: 'Amount depends on project and criteria', status: 'Open',
    deadline: '31 Oct 2026 for the 30 Nov meeting', region: 'Venue-linked areas across NZ', fit: 'Check geographic eligibility',
    description: 'Grassroots Trust considers eligible community, amateur sport, education and charitable initiatives in areas where its funding can be distributed.',
    eligibility: 'Eligibility depends on the purpose of the grant and the area served, including the Trust’s venue-linked distribution rules. Applications should be submitted at least two months before funding is needed. The listed 31 October 2026 closing date is published for the November 2026 committee meeting and may change; verify it on the official page before applying.',
    source: 'https://www.grassrootstrust.co.nz/apply-for-a-grant/',
    verified: '29 Oct 2026', saved: false, applicationStatus: 'Monitoring'
  },
  {
    id: 'waikato-tainui', name: 'Sports Grant – Organisation or Club', funder: 'Waikato-Tainui',
    category: 'Travel & competition', amount: 'Confirm with funder', status: 'Check with funder',
    deadline: 'No date confirmed', region: 'Eligibility-specific Waikato-Tainui community', fit: 'Eligibility-specific',
    description: 'Potential support for eligible organisations or clubs seeking sports-related assistance.',
    eligibility: 'The person applying on behalf of the club or organisation must be a registered Waikato-Tainui tribal member, and the organisation or club must have at least 75% registered Waikato-Tainui tribal members. Only one application per applicant is allowed per financial year. Confirm current requirements with Waikato-Tainui.',
    source: 'https://waikatotainui.com/grant/sports-organisation/',
    verified: '29 Oct 2026', saved: false, applicationStatus: 'Not started'
  }
]
const statusClass = (status) => status === 'Open' ? 'open' : status === 'Closed' ? 'closed' : 'check'
function loadGrants() {
  try { const stored = localStorage.getItem('infunds-grants-v2'); return stored ? JSON.parse(stored) : initialGrants }
  catch { return initialGrants }
}
function moneyLabel(value) { return value }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function mapDatabaseGrant(row, existing = []) {
  const savedRecord = existing.find(g => g.name === row.title || (g.source && g.source === row.source_url))
  const statusLabels = { open: 'Open', upcoming: 'Upcoming', closed: 'Closed', rolling: 'Rolling', needs_review: 'Needs review' }
  const verification = row.last_verified_at
    ? new Date(`${row.last_verified_at}T12:00:00`).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Not yet verified'
  return {
    id: row.id,
    name: row.title,
    funder: row.funders?.name || 'Funder to confirm',
    category: Array.isArray(row.categories) && row.categories.length ? row.categories[0] : 'Community projects',
    amount: row.amount_text || 'Check with funder',
    status: statusLabels[row.status] || 'Needs review',
    deadline: row.deadline ? new Date(`${row.deadline}T12:00:00`).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }) : (row.deadline_notes || 'Check with funder'),
    region: Array.isArray(row.regions) ? row.regions.join(', ') : 'Check with funder',
    fit: row.verification_status === 'verified' ? 'Source checked' : 'Needs review',
    description: row.description || '',
    eligibility: row.eligibility || 'Confirm eligibility directly with the funder.',
    source: row.source_url || row.application_url || '',
    verified: verification,
    verificationStatus: row.verification_status || 'unverified',
    saved: savedRecord?.saved ?? false,
    applicationStatus: savedRecord?.applicationStatus || 'Not started'
  }
}


export default function App() {
  const [grants, setGrants] = useState(loadGrants)
  const [dataSource, setDataSource] = useState(supabase ? 'loading' : 'demo')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All grants')
  const [category, setCategory] = useState('All categories')
  const [activePage, setActivePage] = useState('Overview')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ name: '', funder: '', amount: '', deadline: '', region: 'Waikato', category: 'Community projects', source: '', description: '' })
  const [matchProfile, setMatchProfile] = useState({
    region: 'Waikato', organisationType: 'Incorporated society or charity',
    projectPurpose: 'Participation & inclusion', participants: 'Children and young people',
    budget: '5000', notes: ''
  })

  useEffect(() => {
    let cancelled = false
    async function loadDatabaseGrants() {
      if (!supabase) {
        setDataSource('demo')
        return
      }
      const { data, error } = await supabase
        .from('funding_opportunities')
        .select('*, funders(name)')
        .order('deadline', { ascending: true, nullsFirst: false })
      if (cancelled) return
      if (error) {
        console.error('Unable to load InFunds funding records:', error.message)
        setDataSource('error')
        return
      }
      if (data) {
        let previous = []
        try { previous = JSON.parse(localStorage.getItem('infunds-grants-v2') || '[]') } catch {}
        const databaseGrants = data.map(row => mapDatabaseGrant(row, previous))
        // Keep locally-added opportunities that are not in the shared database.
        const localOnly = previous.filter(g => String(g.id).startsWith('custom-'))
        setGrants([...databaseGrants, ...localOnly])
        setDataSource('database')
      }
    }
    loadDatabaseGrants()
    return () => { cancelled = true }
  }, [])

  const persist = (next) => {
    setGrants(next)
    try { localStorage.setItem('infunds-grants-v2', JSON.stringify(next)) } catch {}
  }
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const categories = ['All categories', ...new Set(grants.map(g => g.category))]
  const visible = useMemo(() => grants.filter(g => {
    const text = `${g.name} ${g.funder} ${g.category} ${g.region} ${g.description}`.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesFilter = filter === 'All grants' || (filter === 'Open now' && g.status === 'Open') || (filter === 'Saved' && g.saved) || (filter === 'Tracking' && g.applicationStatus !== 'Not started')
    const matchesCategory = category === 'All categories' || g.category === category
    const matchesPage = activePage !== 'Saved grants' || g.saved
    const matchesApps = activePage !== 'Applications' || g.applicationStatus !== 'Not started'
    return matchesQuery && matchesFilter && matchesCategory && matchesPage && matchesApps
  }), [grants, query, filter, category, activePage])

  const openCount = grants.filter(g => g.status === 'Open').length
  const savedCount = grants.filter(g => g.saved).length
  const trackedCount = grants.filter(g => g.applicationStatus !== 'Not started').length

  function toggleSaved(id) {
    persist(grants.map(g => g.id === id ? { ...g, saved: !g.saved } : g))
    notify('Saved grants updated')
  }
  function updateApplication(id, applicationStatus) {
    persist(grants.map(g => g.id === id ? { ...g, applicationStatus } : g))
    if (selected?.id === id) setSelected({ ...selected, applicationStatus })
    notify('Application status updated')
  }
  function addGrant(e) {
    e.preventDefault()
    const newGrant = { ...form, id: `custom-${Date.now()}`, status: 'Check with funder', fit: 'Not assessed', verified: 'Added by you', saved: false, applicationStatus: 'Not started', eligibility: 'Confirm eligibility and current round details directly with the funder.' }
    persist([newGrant, ...grants])
    setShowAdd(false)
    setForm({ name: '', funder: '', amount: '', deadline: '', region: 'Waikato', category: 'Community projects', source: '', description: '' })
    setActivePage('Overview')
    setFilter('All grants')
    notify('Grant added to this browser only. Shared submission is not enabled yet.')
  }

  const matchResults = useMemo(() => {
    const purposeMap = {
      'Participation & inclusion': ['participation', 'inclusion', 'community', 'sport', 'active', 'welcoming', 'children', 'young'],
      'Equipment': ['equipment', 'facility', 'development', 'sport', 'community'],
      'Facilities & development': ['facility', 'development', 'community', 'club'],
      'Coaching & programmes': ['programme', 'participation', 'sport', 'children', 'young', 'community'],
      'Travel & competition': ['tournament', 'travel', 'sports', 'club', 'competition'],
      'Community projects': ['community', 'inclusion', 'wellbeing', 'sport', 'welcoming']
    }
    const purposeTerms = purposeMap[matchProfile.projectPurpose] || []
    const budgetNumber = Number(matchProfile.budget) || 0
    return grants.map(g => {
      let score = 0
      const text = `${g.name} ${g.funder} ${g.category} ${g.description} ${g.eligibility}`.toLowerCase()
      const region = (matchProfile.region || '').toLowerCase()
      if (region && (g.region.toLowerCase().includes(region) || region.includes(g.region.toLowerCase()) || g.region.toLowerCase() === 'waikato')) score += 25
      if (g.category === matchProfile.projectPurpose) score += 30
      else if (purposeTerms.some(term => text.includes(term))) score += 14
      if (matchProfile.participants === 'Children and young people' && /children|young people|tamariki|rangatahi|youth|school/.test(text)) score += 20
      if (matchProfile.participants === 'Newcomers and inclusion' && /welcoming|inclusion|newcomer|connection|access/.test(text)) score += 20
      if (matchProfile.participants === 'Whole community' && /community|sport|club|wellbeing/.test(text)) score += 15
      if (matchProfile.organisationType === 'Incorporated society or charity' && /not-for-profit|charit|organisation|community/.test(text)) score += 10
      if (matchProfile.organisationType === 'School' && /school|children|young people|tamariki|rangatahi/.test(text)) score += 10
      if (matchProfile.organisationType === 'Informal community group' && /community|participation|inclusion/.test(text)) score += 5
      if (budgetNumber > 0 && /up to \$?5,000|\$5,000/.test(g.amount) && budgetNumber <= 5000) score += 5
      if (g.status === 'Open') score += 10
      if (g.status === 'Closed') score -= 25
      if (/check with funder|unconfirmed|tbc/i.test(`${g.status} ${g.deadline} ${g.amount}`)) score -= 5
      return { ...g, matchScore: Math.max(0, Math.min(100, score)) }
    }).sort((a,b) => b.matchScore - a.matchScore)
  }, [grants, matchProfile])

  const nav = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'All grants', icon: Search },
    { name: 'Grant matching', icon: WandSparkles },
    { name: 'Saved grants', icon: Bookmark },
    { name: 'Applications', icon: FolderOpen }
  ]

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><HeartHandshake size={22}/></div><div><div className="brand-name">InFunds</div><div className="brand-sub">SPORT FUNDING HUB</div></div><button className="icon-btn close-menu" onClick={() => setMobileMenu(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="org-switch"><div className="org-avatar">SC</div><div className="org-copy"><strong>Sports Club Demo</strong><span>Community organisation</span></div><ChevronDown size={15}/></div>
      <nav className="main-nav">
        {nav.map(item => <button key={item.name} className={`nav-item ${activePage === item.name ? 'active' : ''}`} onClick={() => { setActivePage(item.name); setMobileMenu(false); if(item.name === 'All grants') setFilter('All grants') }}><item.icon size={18}/><span>{item.name}</span>{item.name === 'Saved grants' && <span className="nav-count">{savedCount}</span>}</button>)}
      </nav>
      <div className="sidebar-divider"/>
      <div className="workspace-label">TOOLS</div>
      <button className="nav-item" onClick={() => { setShowAdd(true); setMobileMenu(false) }}><Plus size={18}/><span>Add a grant</span></button>
      <button className="nav-item" onClick={() => { setActivePage('Overview'); setFilter('Tracking'); setMobileMenu(false) }}><Activity size={18}/><span>Grant round tracker</span></button>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><Sparkles size={17}/></div><strong>Funding, made clearer.</strong><p>Find opportunities, check fit and keep your next steps in one place.</p><button onClick={() => notify('Demo version: grant data is stored in this browser.')}>How InFunds works <ArrowUpRight size={14}/></button></div>
        <div className="demo-note"><ShieldCheck size={15}/><span>{dataSource === 'database' ? 'Funding records from shared database' : dataSource === 'error' ? 'Could not load database records' : 'Funding data preview'}</span></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenu(true)}><Menu size={20}/></button>
        <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
        <div className="top-actions"><span className="demo-pill"><span/> {dataSource === 'database' ? 'Live database' : dataSource === 'loading' ? 'Connecting…' : dataSource === 'error' ? 'Database issue' : 'Demo data'}</span><button className="icon-btn" title="Notifications" onClick={() => notify('You’re all caught up')}><Bell size={18}/></button><div className="user-avatar">SC</div></div>
      </header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR FUNDING WORKSPACE</div><h1>{activePage === 'Overview' ? 'Find funding that fits.' : activePage}</h1><p className="subheading">{activePage === 'Overview' ? 'A clearer view of grants for your club, your community and your next big idea.' : activePage === 'Saved grants' ? 'Your shortlist of funding opportunities to come back to.' : activePage === 'Applications' ? 'Keep an eye on opportunities you are considering or preparing.' : 'Search opportunities, check eligibility and keep grant rounds on your radar.'}</p></div><button className="primary-btn" onClick={() => setShowAdd(true)}><Plus size={17}/> Add a grant</button></div>

        {activePage === 'Overview' && <div className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>Open opportunities</span><span className="stat-icon mint"><CircleDollarSign size={18}/></span></div><div className="stat-number">{openCount}</div><div className="stat-foot"><span className="status-dot green"/>Listed as open on the source page when checked</div></div>
          <div className="stat-card"><div className="stat-top"><span>Saved grants</span><span className="stat-icon lilac"><Bookmark size={18}/></span></div><div className="stat-number">{savedCount}</div><div className="stat-foot">Your funding shortlist</div></div>
          <div className="stat-card"><div className="stat-top"><span>Being tracked</span><span className="stat-icon peach"><Target size={18}/></span></div><div className="stat-number">{trackedCount}</div><div className="stat-foot">Considering or monitoring</div></div>
          <div className="stat-card"><div className="stat-top"><span>Regions covered</span><span className="stat-icon blue"><Users size={18}/></span></div><div className="stat-number">{new Set(grants.map(g => g.region)).size}</div><div className="stat-foot">Funding areas in the current list</div></div>
        </div>}

        <section className="feature-banner"><div className="banner-symbol"><HeartHandshake size={25}/></div><div className="banner-copy"><span className="banner-kicker">A BETTER WAY TO FIND FUNDING</span><h2>Spend less time searching. More time making sport happen.</h2><p>Compare opportunities, check the fine print and track the next step, all in one workspace.</p></div><div className="banner-art"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="art-card"><div className="art-card-top"><span>Funding fit</span><Sparkles size={14}/></div><div className="art-bar"><i/></div><div className="art-line short"/><div className="art-line"/></div><div className="art-check"><Check size={17}/></div></div></section>

        {activePage === 'Grant matching' && <section className="matching-layout">
          <div className="match-form-card">
            <div className="match-card-heading"><div className="match-heading-icon"><WandSparkles size={19}/></div><div><h2>Tell us about your project</h2><p>We'll compare your answers with the current seed list. Always verify eligibility with the funder.</p></div></div>
            <div className="match-form-grid">
              <label>Where is your organisation based?
                <select value={matchProfile.region} onChange={e => setMatchProfile({...matchProfile, region:e.target.value})}>
                  <option>Waikato</option><option>Hamilton</option><option>Waipā</option><option>South Waikato</option><option>New Zealand</option>
                </select>
              </label>
              <label>Organisation type
                <select value={matchProfile.organisationType} onChange={e => setMatchProfile({...matchProfile, organisationType:e.target.value})}>
                  <option>Incorporated society or charity</option><option>School</option><option>Informal community group</option><option>Sports club</option><option>Business</option>
                </select>
              </label>
              <label>What do you want funding for?
                <select value={matchProfile.projectPurpose} onChange={e => setMatchProfile({...matchProfile, projectPurpose:e.target.value})}>
                  <option>Participation & inclusion</option><option>Equipment</option><option>Facilities & development</option><option>Coaching & programmes</option><option>Travel & competition</option><option>Community projects</option>
                </select>
              </label>
              <label>Who will benefit?
                <select value={matchProfile.participants} onChange={e => setMatchProfile({...matchProfile, participants:e.target.value})}>
                  <option>Children and young people</option><option>Newcomers and inclusion</option><option>Whole community</option><option>Competitive athletes</option><option>Older adults</option>
                </select>
              </label>
              <label>Approximate project budget (NZD)
                <input type="number" min="0" value={matchProfile.budget} onChange={e => setMatchProfile({...matchProfile,budget:e.target.value})} placeholder="e.g. 5000"/>
              </label>
              <label>Extra project details (optional)
                <input value={matchProfile.notes} onChange={e => setMatchProfile({...matchProfile,notes:e.target.value})} placeholder="e.g. low-cost after-school sport"/>
              </label>
            </div>
            <div className="match-disclaimer"><ShieldCheck size={15}/><span>Scores are indicative keyword matches, not eligibility decisions. Some opportunities need local or project-specific checks. Confirm all details with the funder.</span></div>
          </div>
          <div className="match-results">
            <div className="match-results-heading"><div><div className="eyebrow"><Sparkles size={13}/> YOUR SHORTLIST</div><h2>Potential funding matches</h2><p>Ranked against your project profile.</p></div><span className="match-count">{matchResults.length} grants</span></div>
            {matchResults.map((g, idx) => <article className="match-result-card" key={g.id}>
              <div className="match-result-top"><div className="funder-logo">{g.funder.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</div><div className="match-result-title"><strong>{g.name}</strong><span>{g.funder} · {g.category}</span></div><div className={`match-score ${g.matchScore >= 65 ? 'score-high' : g.matchScore >= 40 ? 'score-mid' : 'score-low'}`}><strong>{g.matchScore}%</strong><span>indicative fit</span></div></div>
              <div className="match-meter"><span style={{width:`${g.matchScore}%`}}/></div>
              <div className="match-result-meta"><span className={`status-badge ${statusClass(g.status)}`}><span/>{g.status}</span><span><CalendarDays size={13}/>{g.deadline}</span></div>
              <p>{g.description}</p>
              <div className="match-result-actions"><button className="secondary-btn" onClick={() => setSelected(g)}>Review eligibility</button><button className={`save-btn ${g.saved ? 'saved' : ''}`} onClick={() => toggleSaved(g.id)}><Bookmark size={16} fill={g.saved ? 'currentColor' : 'none'}/>{g.saved ? 'Saved' : 'Save match'}</button></div>
            </article>)}
          </div>
        </section>}

        {activePage !== 'Grant matching' && <div className="section-heading"><div><h2>{activePage === 'Overview' ? 'Funding opportunities' : activePage === 'Applications' ? 'Your tracked opportunities' : activePage === 'Saved grants' ? 'Your saved grants' : 'All funding opportunities'}</h2><p>Browse current listings and check the source before applying.</p></div><button className="text-btn" onClick={() => { setActivePage('All grants'); setFilter('All grants') }}>View all grants <ArrowUpRight size={15}/></button></div>}
        {activePage !== 'Grant matching' && <><div className="toolbar"><div className="searchbox"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search grants, funders or keywords..." aria-label="Search grants"/></div><div className="filter-select"><SlidersHorizontal size={16}/><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter grants"><option>All grants</option><option>Open now</option><option>Saved</option><option>Tracking</option></select><ChevronDown size={14}/></div><div className="filter-select category-select"><Filter size={16}/><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">{categories.map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={14}/></div></div>

        <div className="grant-list">
          <div className="list-head"><span>FUNDING OPPORTUNITY</span><span>STATUS</span><span>DEADLINE</span><span>FUNDING</span><span/></div>
          {visible.length === 0 && <div className="empty-state"><FolderOpen size={28}/><strong>No grants found</strong><p>Try another search or clear your filters.</p><button className="secondary-btn" onClick={() => {setQuery('');setFilter('All grants');setCategory('All categories')}}>Clear filters</button></div>}
          {visible.map(g => <div className="grant-row" key={g.id}>
            <button className="grant-main" onClick={() => setSelected(g)}><div className="funder-logo">{g.funder.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</div><div className="grant-info"><strong>{g.name}</strong><span>{g.funder} <i>·</i> {g.category}</span><small><ShieldCheck size={12}/> Checked {g.verified}</small></div></button>
            <div className="row-status"><span className={`status-badge ${statusClass(g.status)}`}><span/>{g.status}</span><span className="fit-label">{g.fit === 'High' ? 'Strong potential fit' : g.fit === 'Medium' ? 'Check project fit' : g.fit}</span></div>
            <div className="deadline-cell"><CalendarDays size={15}/><span>{g.deadline}</span></div>
            <div className="amount-cell">{moneyLabel(g.amount)}</div>
            <div className="row-actions"><button className={`save-btn ${g.saved ? 'saved' : ''}`} title={g.saved ? 'Remove from saved' : 'Save grant'} onClick={() => toggleSaved(g.id)}><Bookmark size={17} fill={g.saved ? 'currentColor' : 'none'}/></button><button className="more-btn" title="View details" onClick={() => setSelected(g)}><ArrowUpRight size={17}/></button></div>
          </div>)}
        </div>
        <div className="data-note"><ShieldCheck size={16}/><div><strong>Always check the original source.</strong><span>Grant rounds and eligibility can change. Check each official source before applying. Verification dates and availability can change. Some listings may still need review.</span></div></div></>}
        <footer><span>© 2026 InFunds · Demo workspace</span><span>Built to help community sport thrive <HeartHandshake size={14}/></span></footer>
      </div>
    </main>

    {selected && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setSelected(null)}}><div className="detail-modal"><div className="modal-header"><div className="modal-logo">{selected.funder.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</div><button className="icon-btn" onClick={() => setSelected(null)}><X size={19}/></button></div><div className="modal-content"><div className="eyebrow">{selected.funder}</div><h2>{selected.name}</h2><div className="detail-pills"><span className={`status-badge ${statusClass(selected.status)}`}><span/>{selected.status}</span><span className="detail-category">{selected.category}</span></div><p className="detail-description">{selected.description}</p><div className="detail-grid"><div><span>Funding amount</span><strong>{selected.amount}</strong></div><div><span>Deadline / round</span><strong>{selected.deadline}</strong></div><div><span>Region</span><strong>{selected.region}</strong></div><div><span>Last checked</span><strong>{selected.verified}</strong></div></div><div className="eligibility-box"><h3><ShieldCheck size={16}/> Eligibility notes</h3><p>{selected.eligibility}</p></div><div className="application-control"><label htmlFor="appstatus">Your application status</label><select id="appstatus" value={selected.applicationStatus} onChange={e => updateApplication(selected.id,e.target.value)}><option>Not started</option><option>Considering</option><option>Monitoring</option><option>Preparing application</option><option>Submitted</option><option>Successful</option><option>Unsuccessful</option></select></div><div className="modal-actions"><button className="secondary-btn" onClick={() => toggleSaved(selected.id)}><Bookmark size={16} fill={selected.saved ? 'currentColor' : 'none'}/>{selected.saved ? 'Saved' : 'Save grant'}</button><a className="primary-btn" href={selected.source || '#'} target="_blank" rel="noreferrer" onClick={e => {if(!selected.source){e.preventDefault();notify('Add an official source URL to this grant first.')}}}>Official source <ExternalLink size={16}/></a></div><p className="modal-disclaimer">Confirm current dates, eligibility and requirements with the funder before committing to an application.</p></div></div></div>}

    {showAdd && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setShowAdd(false)}}><form className="add-modal" onSubmit={addGrant}><div className="modal-header"><div><div className="eyebrow">YOUR FUNDING TRACKER</div><h2>Add a grant</h2></div><button type="button" className="icon-btn" onClick={() => setShowAdd(false)}><X size={19}/></button></div><div className="form-grid"><label>Grant name *<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Community Sport Fund"/></label><label>Funder *<input required value={form.funder} onChange={e=>setForm({...form,funder:e.target.value})} placeholder="Funding organisation"/></label><label>Funding amount<input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="e.g. Up to $5,000"/></label><label>Deadline / round<input value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} placeholder="e.g. 30 June 2027"/></label><label>Region<input value={form.region} onChange={e=>setForm({...form,region:e.target.value})} placeholder="e.g. Waikato"/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Community projects','Participation & inclusion','Facilities & development','Equipment','Coaching & programmes','Travel & competition','Inclusion & connection','Community wellbeing'].map(c=><option key={c}>{c}</option>)}</select></label><label className="full-field">Official source URL<input type="url" value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="https://"/></label><label className="full-field">Notes / what it supports<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What could this grant support?"/></label></div><div className="form-footer"><span>New entries are marked “Check with funder”.</span><button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Add grant</button></div></form></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}