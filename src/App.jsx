import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Bookmark, CalendarDays,
  Check, ChevronDown, CircleDollarSign, Clock3, ExternalLink, Filter,
  FolderOpen, HeartHandshake, LayoutDashboard, Menu, Plus, Search,
  Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Target, Users, X, WandSparkles, LogIn, LogOut
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

// UI convenience only. Supabase Row Level Security remains the real security boundary.
const ADMIN_USER_ID = '5cc54c8b-231c-4165-88fe-d08c84a6a6dc'

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
  const [showAuth, setShowAuth] = useState(false)
  const [session, setSession] = useState(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const isAdmin = Boolean(session?.user?.id === ADMIN_USER_ID)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const emptyGrantForm = { name: '', funder: '', amount: '', deadline: '', region: 'Waikato', category: 'Community projects', source: '', description: '', eligibility: '' }
  const [form, setForm] = useState(emptyGrantForm)
  const [matchProfile, setMatchProfile] = useState({
    region: 'Waikato', organisationType: 'Incorporated society or charity',
    projectPurpose: 'Participation & inclusion', participants: 'Children and young people',
    budget: '5000', notes: ''
  })

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) {
        setShowAdd(false)
        setShowAuth(false)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInAdmin(e) {
    e.preventDefault()
    if (!supabase) {
      setAuthMessage('Supabase is not configured. Check the Vercel environment variables.')
