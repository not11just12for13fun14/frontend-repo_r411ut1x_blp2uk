import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">ABDULLAH HOUSING</Link>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>☰</button>
        <nav className={`$${open ? 'block' : 'hidden'} md:block`}>
          <ul className="md:flex md:gap-6 text-sm font-medium">
            <li><Link className="hover:text-blue-600" to="/">Home</Link></li>
            <li><Link className="hover:text-blue-600" to="/about">About</Link></li>
            <li><Link className="hover:text-blue-600" to="/projects">Upcoming Projects</Link></li>
            <li><Link className="hover:text-blue-600" to="/plots">Plot Details</Link></li>
            <li><Link className="hover:text-blue-600" to="/noc">NOC & Licenses</Link></li>
            <li><Link className="hover:text-blue-600" to="/map">Society Map</Link></li>
            <li><Link className="hover:text-blue-600" to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm bg-white">© {new Date().getFullYear()} Abdullah Housing. All rights reserved.</footer>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Welcome to Abdullah Housing</h1>
          <p className="mt-4 text-lg text-gray-600">Modern living with parks, schools, and secure gated access. Explore plots, upcoming projects, and official approvals.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/plots" className="px-5 py-3 rounded bg-blue-600 text-white hover:bg-blue-700">View Plots</Link>
            <Link to="/projects" className="px-5 py-3 rounded bg-gray-900 text-white hover:bg-black">Upcoming Projects</Link>
          </div>
        </div>
        <img alt="Housing" className="w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1400&auto=format&fit=crop" />
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <Layout>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          {title: 'Secure Living', desc: '24/7 security and gated entries for peace of mind.'},
          {title: 'Family Amenities', desc: 'Parks, schools, and community centers.'},
          {title: 'Prime Location', desc: 'Easy access to main roads and city centers.'},
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
            <h3 className="font-semibold text-lg">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
          </div>
        ))}
      </section>
    </Layout>
  )
}

function AboutPage() {
  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold">About Abdullah Housing</h2>
        <p className="mt-4 text-gray-600">We are committed to delivering high-quality, well-planned residential communities with essential amenities, green spaces, and modern infrastructure.</p>
      </section>
    </Layout>
  )
}

function ProjectsPage() {
  const [items, setItems] = useState([])
  useEffect(() => { fetch(`${API_BASE}/api/projects`).then(r=>r.json()).then(setItems).catch(()=>setItems([])) }, [])
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-6">Upcoming Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map(p => (
            <div key={p._id} className="bg-white rounded-lg shadow overflow-hidden">
              {p.cover_image && <img src={p.cover_image} alt={p.title} className="h-40 w-full object-cover" />}
              <div className="p-5">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">{p.status}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-gray-600">No items yet. Admin can add via API.</div>
          )}
        </div>
      </section>
    </Layout>
  )
}

function PlotsPage() {
  const [plots, setPlots] = useState([])
  const [status, setStatus] = useState('')
  useEffect(() => { const qs = status?`?status=${status}`:''; fetch(`${API_BASE}/api/plots${qs}`).then(r=>r.json()).then(setPlots).catch(()=>setPlots([])) }, [status])
  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Plot Details</h2>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plots.map(p => (
            <div key={p._id} className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-semibold">Plot #{p.plot_no}</h3>
              <p className="text-sm text-gray-600">Size: {p.size}</p>
              {p.sector && <p className="text-sm text-gray-600">Sector: {p.sector}</p>}
              {p.price && <p className="text-sm text-gray-600">Price: Rs. {p.price.toLocaleString?.() || p.price}</p>}
              <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{p.status}</span>
            </div>
          ))}
          {plots.length === 0 && <div className="text-gray-600">No plots found.</div>}
        </div>
      </section>
    </Layout>
  )
}

function NOCPage() {
  const [info, setInfo] = useState(null)
  useEffect(() => { fetch(`${API_BASE}/api/noc`).then(r=>r.json()).then(setInfo).catch(()=>setInfo(null)) }, [])
  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold">NOC & Licenses</h2>
        {info ? (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">{info.overview}</p>
            <ul className="mt-4 space-y-2">
              {info.documents.map((d, i) => (
                <li key={i} className="flex items-center justify-between border rounded px-3 py-2">
                  <span>{d.name}</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">{d.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : <p className="text-gray-600 mt-4">Loading...</p>}
      </section>
    </Layout>
  )
}

function MapPage() {
  const [map, setMap] = useState(null)
  useEffect(() => { fetch(`${API_BASE}/api/map`).then(r=>r.json()).then(setMap).catch(()=>setMap(null)) }, [])
  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-4">Society Map</h2>
        {map && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img src={map.map_image} alt="Society Map" className="w-full max-h-[560px] object-cover" />
            <p className="p-4 text-gray-700">{map.description}</p>
          </div>
        )}
      </section>
    </Layout>
  )
}

function LoginPage() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [mode, setMode] = useState('login')
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login' ? { email: form.email, password: form.password } : form
      const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')
      localStorage.setItem('ah_token', data.token)
      localStorage.setItem('ah_user', JSON.stringify(data.user))
      setMsg(data.message)
      setTimeout(()=> nav('/'), 800)
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <Layout>
      <section className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-4">
            <button onClick={()=>setMode('login')} className={`px-3 py-2 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-gray-100'}`}>Login</button>
            <button onClick={()=>setMode('register')} className={`px-3 py-2 rounded ${mode==='register'?'bg-blue-600 text-white':'bg-gray-100'}`}>Register</button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            {mode==='register' && (
              <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Full Name" className="w-full border rounded px-3 py-2" />
            )}
            <input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="w-full border rounded px-3 py-2" />
            <input required type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} placeholder="Password" className="w-full border rounded px-3 py-2" />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">{mode==='login'?'Login':'Create Account'}</button>
            {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
          </form>
        </div>
      </section>
    </Layout>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/plots" element={<PlotsPage />} />
        <Route path="/noc" element={<NOCPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
