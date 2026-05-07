import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Edit, Trash2, ShoppingBag, Hammer, Package,
  Users, Calendar, Phone, Lock, Mail, Eye, EyeOff, LogOut,
  Search, Image as ImageIcon, Video as VideoIcon,
  Sparkles, Crown, FileText
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/ImageUpload'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

type ItemRow = {
  id: string
  name: string
  details: string
  raw?: any
}

type TabId =
  | 'boutique' | 'artisanat' | 'commandes' | 'clients'
  | 'galerie' | 'coulisses'
  | 'custom_requests' | 'subscriptions' | 'contracts'

const localOnlyTabs: TabId[] = []
const initialLocal: Record<string, ItemRow[]> = {}

const galleryCategories = [
  'Fleurs Artificielles',
  'Fleurs Naturelles',
  'Bouquets Argent',
  'Fleurs Éternelles',
]

const productCategories = [
  'Saint-Valentin', 'Anniversaire', 'Mariage', 'Fête des Mères', 'Événement', 'Pack Célébration',
]

const artisanatCategories = ['Mug', 'Accessoire', 'Décoration', 'Souvenir', 'Autre']

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('boutique')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [localData, setLocalData] = useState<Record<string, ItemRow[]>>(initialLocal)
  const [remoteData, setRemoteData] = useState<Record<string, ItemRow[]>>({
    boutique: [], artisanat: [], galerie: [], custom_requests: [], subscriptions: [], contracts: []
  })

  const [search, setSearch] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDetails, setEditDetails] = useState('')

  // Form state — galerie
  const [galTitle, setGalTitle] = useState('')
  const [galCat, setGalCat] = useState(galleryCategories[0])
  const [galUrl, setGalUrl] = useState('')

  // Form state — produits
  const [pName, setPName] = useState('')
  const [pPrice, setPPrice] = useState<string>('')
  const [pCat, setPCat] = useState(productCategories[0])
  const [pDesc, setPDesc] = useState('')
  const [pImg, setPImg] = useState('')

  // Form state — artisanat
  const [aName, setAName] = useState('')
  const [aPrice, setAPrice] = useState<string>('')
  const [aCat, setACat] = useState(artisanatCategories[0])
  const [aDesc, setADesc] = useState('')
  const [aImg, setAImg] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "samarabendieunicavictor@gmail.com" && password === "Samayoo2026") {
      setIsAuthenticated(true)
    } else {
      toast.error("Identifiants incorrects.")
    }
  }

  const loadRemote = useCallback(async () => {
    const [p, a, g, c, s, ct] = await Promise.all([
      supabase.from('products' as any).select('*').order('created_at', { ascending: false }),
      supabase.from('artisanat' as any).select('*').order('created_at', { ascending: false }),
      supabase.from('gallery_items').select('*').order('created_at', { ascending: false }),
      supabase.from('custom_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
      supabase.from('contracts').select('*').order('created_at', { ascending: false }),
    ])
    setRemoteData({
      boutique: (p.data ?? []).map((r: any) => ({
        id: r.id, name: r.name,
        details: `${Number(r.price).toLocaleString('fr-FR')} HTG · ${r.category ?? '—'} · Stock ${r.stock ?? 0}`
      })),
      artisanat: ((a.data as any[]) ?? []).map((r: any) => ({
        id: r.id, name: r.name,
        details: `${Number(r.price).toLocaleString('fr-FR')} HTG · ${r.category ?? '—'} · Stock ${r.stock ?? 0}`
      })),
      galerie: (g.data ?? []).map((r: any) => ({
        id: r.id, name: r.title, details: `${r.category}${r.description ? ' · ' + r.description : ''}`
      })),
      custom_requests: (c.data ?? []).map((r: any) => ({
        id: r.id, name: r.full_name,
        details: `${r.bouquet_type} · ${r.support} · ${r.colors} · ${r.phone} · ${r.status}`
      })),
      subscriptions: (s.data ?? []).map((r: any) => ({
        id: r.id, name: r.full_name,
        details: `${r.formula?.toUpperCase()} · ${r.phone} · ${r.status}`
      })),
      contracts: (ct.data ?? []).map((r: any) => ({
        id: r.id, name: r.client_name,
        details: `${r.event_type}${r.event_date ? ' · ' + r.event_date : ''} · ${r.phone} · ${r.status}`
      })),
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated) loadRemote()
  }, [isAuthenticated, loadRemote])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-elegant border border-border">
          <div className="text-center mb-8">
            <div className="bg-accent/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent" size={30} />
            </div>
            <h2 className="text-2xl font-bold text-foreground font-display">Accès Administration</h2>
            <p className="text-muted-foreground mt-2 text-sm">Espace privé Samayoo Flowers</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary bg-background"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary bg-background"
                  required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 shadow-soft transition-all active:scale-95">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'boutique', label: 'Boutique', icon: <ShoppingBag size={18} /> },
    { id: 'artisanat', label: 'Artisanat', icon: <Hammer size={18} /> },
    { id: 'commandes', label: 'Commandes', icon: <Package size={18} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={18} /> },
    { id: 'galerie', label: 'Galerie', icon: <ImageIcon size={18} /> },
    { id: 'coulisses', label: 'Coulisses', icon: <VideoIcon size={18} /> },
    { id: 'custom_requests', label: 'Demandes Sur-Mesure', icon: <Sparkles size={18} /> },
    { id: 'subscriptions', label: 'Gestion Abonnements', icon: <Crown size={18} /> },
    { id: 'contracts', label: 'Suivi Contrats', icon: <FileText size={18} /> },
  ]

  const isLocal = localOnlyTabs.includes(activeTab)
  const data = isLocal ? localData : remoteData
  const currentSearch = search[activeTab] ?? ''
  const rows = (data[activeTab] ?? []).filter(r => {
    const q = currentSearch.toLowerCase().trim()
    if (!q) return true
    return r.name.toLowerCase().includes(q) || r.details.toLowerCase().includes(q)
  })

  const tableMap: Partial<Record<TabId, string>> = {
    boutique: 'products',
    artisanat: 'artisanat',
    galerie: 'gallery_items',
    custom_requests: 'custom_requests',
    subscriptions: 'subscriptions',
    contracts: 'contracts',
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return
    if (isLocal) {
      setLocalData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(r => r.id !== id) }))
      toast.success('Supprimé')
      return
    }
    const table = tableMap[activeTab]
    if (!table) return
    const { error } = await supabase.from(table as any).delete().eq('id', id)
    if (error) return toast.error('Erreur : ' + error.message)
    toast.success('Produit supprimé avec succès')
    loadRemote()
  }

  const startEdit = (row: ItemRow) => {
    setEditingId(row.id); setEditName(row.name); setEditDetails(row.details)
  }

  const saveEdit = async () => {
    if (!editingId) return
    if (isLocal) {
      setLocalData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(r => r.id === editingId ? { ...r, name: editName, details: editDetails } : r)
      }))
      setEditingId(null)
      toast.success('Mis à jour')
      return
    }
    const table = tableMap[activeTab]
    if (!table) return
    let updates: any = {}
    if (activeTab === 'boutique') updates = { name: editName, description: editDetails }
    if (activeTab === 'artisanat') updates = { name: editName, description: editDetails }
    if (activeTab === 'galerie') updates = { title: editName, description: editDetails }
    if (activeTab === 'custom_requests') updates = { full_name: editName, notes: editDetails }
    if (activeTab === 'subscriptions') updates = { full_name: editName, notes: editDetails }
    if (activeTab === 'contracts') updates = { client_name: editName, description: editDetails }
    const { error } = await supabase.from(table as any).update(updates).eq('id', editingId)
    if (error) return toast.error('Erreur : ' + error.message)
    toast.success('Mis à jour avec succès')
    setEditingId(null)
    loadRemote()
  }

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galTitle || !galUrl) return toast.error('Titre et URL image requis')
    const { error } = await supabase.from('gallery_items').insert({
      title: galTitle, category: galCat, image_url: galUrl
    })
    if (error) return toast.error('Erreur : ' + error.message)
    toast.success('Image ajoutée à la galerie')
    setGalTitle(''); setGalUrl('')
    loadRemote()
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pName || !pPrice) return toast.error('Nom et prix requis')
    const { error } = await supabase.from('products' as any).insert({
      name: pName,
      price: Number(pPrice),
      category: pCat,
      description: pDesc || null,
      image_url: pImg || null,
    })
    if (error) return toast.error('Erreur : ' + error.message)
    toast.success('Produit ajouté avec succès')
    setPName(''); setPPrice(''); setPDesc(''); setPImg('')
    loadRemote()
  }

  const handleAddArtisanat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aName || !aPrice) return toast.error('Nom et prix requis')
    const { error } = await supabase.from('artisanat' as any).insert({
      name: aName,
      price: Number(aPrice),
      category: aCat,
      description: aDesc || null,
      image_url: aImg || null,
    })
    if (error) return toast.error('Erreur : ' + error.message)
    toast.success('Article artisanat ajouté avec succès')
    setAName(''); setAPrice(''); setADesc(''); setAImg('')
    loadRemote()
  }

  const formTitle =
    activeTab === 'boutique' ? 'Nouveau Produit'
    : activeTab === 'artisanat' ? 'Nouvel Article Artisanat'
    : activeTab === 'commandes' ? 'Nouvelle Commande'
    : activeTab === 'clients' ? 'Nouveau Client'
    : activeTab === 'galerie' ? 'Ajouter une image à la Galerie'
    : activeTab === 'coulisses' ? 'Ajouter une vidéo'
    : activeTab === 'custom_requests' ? 'Demandes Sur-Mesure (lecture seule)'
    : activeTab === 'subscriptions' ? 'Abonnements (lecture seule)'
    : activeTab === 'contracts' ? 'Contrats (lecture seule)'
    : `Ajouter (${activeTab})`

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-6 rounded-2xl shadow-soft border border-border">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-foreground font-display">Dashboard Samayoo</h1>
            <p className="text-sm text-accent font-medium">Session : {email}</p>
          </div>
          <button onClick={() => { setIsAuthenticated(false); setEmail(''); setPassword('') }}
            className="flex items-center gap-2 text-sm font-bold text-destructive hover:opacity-80 bg-destructive/10 px-5 py-2.5 rounded-xl transition-colors">
            <LogOut size={18} /> Déconnexion
          </button>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditingId(null) }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-soft scale-105'
                  : 'bg-card text-foreground/70 hover:bg-secondary border border-border'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-6 bg-card rounded-2xl shadow-soft border border-border p-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input type="text" value={currentSearch}
              onChange={(e) => setSearch(prev => ({ ...prev, [activeTab]: e.target.value }))}
              placeholder={`Rechercher dans ${tabs.find(t => t.id === activeTab)?.label}... (nom ou catégorie)`}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-card p-6 rounded-2xl shadow-soft border border-border">
            <h2 className="text-xl font-bold mb-5 text-foreground flex items-center gap-2 font-display">
              <Plus className="text-accent" size={22} /> {formTitle}
            </h2>

            {activeTab === 'boutique' ? (
              <form className="space-y-3" onSubmit={handleAddProduct}>
                <input value={pName} onChange={(e) => setPName(e.target.value)}
                  placeholder="Nom du produit" className="w-full border border-border bg-background p-3 rounded-lg" />
                <input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)}
                  placeholder="Prix (HTG)" className="w-full border border-border bg-background p-3 rounded-lg" />
                <select value={pCat} onChange={(e) => setPCat(e.target.value)}
                  className="w-full border border-border bg-background p-3 rounded-lg">
                  {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Description" rows={3} className="w-full border border-border bg-background p-3 rounded-lg" />
                <ImageUpload value={pImg} onChange={setPImg} folder="products" />
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                  Ajouter le produit
                </button>
              </form>
            ) : activeTab === 'galerie' ? (
              <form className="space-y-3" onSubmit={handleAddGallery}>
                <input value={galTitle} onChange={(e) => setGalTitle(e.target.value)}
                  placeholder="Titre" className="w-full border border-border bg-background p-3 rounded-lg" />
                <select value={galCat} onChange={(e) => setGalCat(e.target.value)}
                  className="w-full border border-border bg-background p-3 rounded-lg">
                  {galleryCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ImageUpload value={galUrl} onChange={setGalUrl} folder="gallery" />
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                  Publier dans la Galerie
                </button>
              </form>
            ) : activeTab === 'artisanat' ? (
              <form className="space-y-3" onSubmit={handleAddArtisanat}>
                <input value={aName} onChange={(e) => setAName(e.target.value)}
                  placeholder="Nom de l'article" className="w-full border border-border bg-background p-3 rounded-lg" />
                <input type="number" value={aPrice} onChange={(e) => setAPrice(e.target.value)}
                  placeholder="Prix (HTG)" className="w-full border border-border bg-background p-3 rounded-lg" />
                <select value={aCat} onChange={(e) => setACat(e.target.value)}
                  className="w-full border border-border bg-background p-3 rounded-lg">
                  {artisanatCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea value={aDesc} onChange={(e) => setADesc(e.target.value)}
                  placeholder="Description" rows={3} className="w-full border border-border bg-background p-3 rounded-lg" />
                <ImageUpload value={aImg} onChange={setAImg} folder="artisanat" />
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                  Ajouter l'article
                </button>
              </form>
            ) : activeTab === 'commandes' ? (
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Référence commande" className="w-full border border-border bg-background p-3 rounded-lg" />
                <input type="number" placeholder="Montant (HTG)" className="w-full border border-border bg-background p-3 rounded-lg" />
                <select className="w-full border border-border bg-background p-3 rounded-lg">
                  <option>En attente</option><option>En préparation</option><option>Livré</option>
                </select>
                <div className="flex items-center gap-2 border border-border bg-background p-3 rounded-lg">
                  <Calendar size={18} className="text-muted-foreground" />
                  <input type="date" className="w-full bg-transparent outline-none" />
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold">Enregistrer</button>
              </form>
            ) : activeTab === 'clients' ? (
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Nom complet" className="w-full border border-border bg-background p-3 rounded-lg" />
                <div className="flex items-center gap-2 border border-border bg-background p-3 rounded-lg">
                  <Phone size={18} className="text-muted-foreground" />
                  <input type="tel" placeholder="Téléphone" className="w-full bg-transparent outline-none" />
                </div>
                <input type="email" placeholder="Email" className="w-full border border-border bg-background p-3 rounded-lg" />
                <textarea placeholder="Adresse" rows={2} className="w-full border border-border bg-background p-3 rounded-lg" />
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold">Enregistrer</button>
              </form>
            ) : activeTab === 'coulisses' ? (
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Titre vidéo" className="w-full border border-border bg-background p-3 rounded-lg" />
                <select className="w-full border border-border bg-background p-3 rounded-lg">
                  <option>Préparation</option><option>Livraisons</option><option>Moments</option>
                </select>
                <input type="file" accept="video/*" className="w-full text-sm text-muted-foreground" />
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold">Publier</button>
              </form>
            ) : (
              <div className="text-sm text-muted-foreground italic p-4 bg-secondary/30 rounded-xl">
                Les éléments de cet onglet sont créés via les formulaires publics du site.
                Vous pouvez ici les rechercher, les modifier et les supprimer.
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-card p-6 rounded-2xl shadow-soft border border-border overflow-x-auto">
            <h2 className="text-xl font-bold mb-5 text-foreground font-display">
              {tabs.find(t => t.id === activeTab)?.label} ({rows.length})
            </h2>
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Élément</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Détails</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground italic">Aucun résultat.</td></tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id}>
                    {editingId === row.id ? (
                      <>
                        <td className="px-3 py-3"><input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border border-border bg-background p-2 rounded-md" /></td>
                        <td className="px-3 py-3"><input value={editDetails} onChange={(e) => setEditDetails(e.target.value)} className="w-full border border-border bg-background p-2 rounded-md" /></td>
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <button onClick={saveEdit} className="text-accent font-semibold hover:bg-accent/10 px-3 py-1 rounded-lg">Sauver</button>
                          <button onClick={() => setEditingId(null)} className="ml-2 text-muted-foreground hover:bg-secondary px-3 py-1 rounded-lg">Annuler</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-3 text-foreground font-medium">{row.name}</td>
                        <td className="px-3 py-3 text-muted-foreground text-sm">{row.details}</td>
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <button onClick={() => startEdit(row)} className="text-primary hover:bg-primary/10 p-2 rounded-lg" aria-label="Modifier"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(row.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg ml-1" aria-label="Supprimer"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
