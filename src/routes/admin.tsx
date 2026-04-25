import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  Plus, Edit, Trash2, ShoppingBag, Hammer, Package, 
  Users, Calendar, Phone, Lock, Mail, Eye, EyeOff, LogOut,
  Search, Image as ImageIcon, Video as VideoIcon
} from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

type ItemRow = {
  id: string
  name: string
  details: string
}

const initialData: Record<string, ItemRow[]> = {
  boutique: [
    { id: 'b1', name: 'Bouquet Romance', details: '1500 HTG · Stock 12' },
    { id: 'b2', name: 'Bouquet Saint-Valentin', details: '2000 HTG · Stock 8' },
  ],
  artisanat: [
    { id: 'a1', name: 'Vase tressé', details: '900 HTG · Stock 5' },
  ],
  commandes: [
    { id: 'c1', name: 'SAM-20260424-AB12', details: 'Marie L. · 3500 HTG · En attente' },
  ],
  clients: [
    { id: 'cl1', name: 'Marie Lubin', details: '+509 1234 5678 · Port-au-Prince' },
  ],
  galerie: [
    { id: 'g1', name: 'Mariage Juin 2025', details: 'Image · Mariage' },
  ],
  coulisses: [
    { id: 'v1', name: 'Livraison à Pétion-Ville', details: 'Vidéo · Livraisons' },
  ],
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('boutique')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState<Record<string, ItemRow[]>>(initialData)
  const [search, setSearch] = useState<Record<string, string>>({
    boutique: '', artisanat: '', commandes: '', clients: '', galerie: '', coulisses: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDetails, setEditDetails] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "samarabendieunicavictor@gmail.com" && password === "Samayoo2026") {
      setIsAuthenticated(true)
    } else {
      alert("Identifiants incorrects. Accès refusé.")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-green-600" size={30} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Accès Administration</h2>
            <p className="text-gray-500 mt-2">Connectez-vous pour gérer Samayoo Flowers</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="adminUser@.com"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="PasswordAdmin"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'boutique', label: 'Boutique', icon: <ShoppingBag size={20} /> },
    { id: 'artisanat', label: 'Artisanat', icon: <Hammer size={20} /> },
    { id: 'commandes', label: 'Commandes', icon: <Package size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    { id: 'galerie', label: 'Galerie', icon: <ImageIcon size={20} /> },
    { id: 'coulisses', label: 'Coulisses', icon: <VideoIcon size={20} /> },
  ]

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return
    setData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(r => r.id !== id) }))
  }

  const startEdit = (row: ItemRow) => {
    setEditingId(row.id)
    setEditName(row.name)
    setEditDetails(row.details)
  }

  const saveEdit = () => {
    if (!editingId) return
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(r =>
        r.id === editingId ? { ...r, name: editName, details: editDetails } : r
      )
    }))
    setEditingId(null)
  }

  const currentSearch = search[activeTab] ?? ''
  const rows = (data[activeTab] ?? []).filter(r => {
    const q = currentSearch.toLowerCase().trim()
    if (!q) return true
    return r.name.toLowerCase().includes(q) || r.details.toLowerCase().includes(q)
  })

  const formTitle =
    activeTab === 'commandes' ? 'Nouvelle Commande'
    : activeTab === 'clients' ? 'Nouveau Client'
    : activeTab === 'galerie' ? 'Ajouter une image à la Galerie'
    : activeTab === 'coulisses' ? 'Ajouter une vidéo aux Coulisses'
    : `Ajouter un article (${activeTab})`

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Samayoo Flowers</h1>
            <p className="text-sm text-green-600 font-medium">Session active : {email}</p>
          </div>
          <button 
            onClick={() => {
              setIsAuthenticated(false)
              setEmail('')
              setPassword('')
            }}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 px-5 py-2.5 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditingId(null) }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${
                activeTab === tab.id 
                ? 'bg-green-600 text-white scale-105 shadow-green-200' 
                : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Barre de recherche horizontale avec loupe */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={currentSearch}
              onChange={(e) => setSearch(prev => ({ ...prev, [activeTab]: e.target.value }))}
              placeholder={`Rechercher dans ${tabs.find(t => t.id === activeTab)?.label}...`}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Plus className="text-green-600" size={24} />
              {formTitle}
            </h2>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {(activeTab === 'boutique' || activeTab === 'artisanat') && (
                <>
                  <input type="text" placeholder="Nom de l'article" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="number" placeholder="Prix (HTG)" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <textarea placeholder="Description" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" rows={3}></textarea>
                  <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700" />
                </>
              )}

              {activeTab === 'commandes' && (
                <>
                  <select className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Sélectionner un client...</option>
                  </select>
                  <input type="number" placeholder="Montant Total (HTG)" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <select className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Statut: En attente</option>
                    <option>Statut: En préparation</option>
                    <option>Statut: Livré</option>
                  </select>
                  <div className="flex items-center gap-2 border p-3 rounded-lg">
                    <Calendar size={18} className="text-gray-400" />
                    <input type="date" className="w-full outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'clients' && (
                <>
                  <input type="text" placeholder="Nom complet du client" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <div className="flex items-center gap-2 border p-3 rounded-lg">
                    <Phone size={18} className="text-gray-400" />
                    <input type="tel" placeholder="Téléphone (WhatsApp)" className="w-full outline-none" />
                  </div>
                  <input type="email" placeholder="Email" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <textarea placeholder="Adresse de livraison" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" rows={2}></textarea>
                </>
              )}

              {activeTab === 'galerie' && (
                <>
                  <input type="text" placeholder="Titre de l'image" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <select className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Catégorie: Mariage</option>
                    <option>Catégorie: Saint-Valentin</option>
                    <option>Catégorie: Deuil</option>
                    <option>Catégorie: Événement</option>
                  </select>
                  <textarea placeholder="Description (optionnelle)" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" rows={2}></textarea>
                  <label className="block">
                    <span className="text-sm text-gray-600 mb-2 block">Image à insérer dans la Galerie</span>
                    <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700" />
                  </label>
                </>
              )}

              {activeTab === 'coulisses' && (
                <>
                  <input type="text" placeholder="Titre de la vidéo" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                  <select className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Catégorie: Préparation</option>
                    <option>Catégorie: Livraisons</option>
                    <option>Catégorie: Moments</option>
                  </select>
                  <textarea placeholder="Description (optionnelle)" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500" rows={2}></textarea>
                  <label className="block">
                    <span className="text-sm text-gray-600 mb-2 block">Vidéo (MP4, WebM)</span>
                    <input type="file" accept="video/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600 mb-2 block">Miniature (poster, optionnelle)</span>
                    <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700" />
                  </label>
                </>
              )}

              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md transition-all active:scale-95">
                {activeTab === 'galerie'
                  ? 'Publier dans la Galerie'
                  : activeTab === 'coulisses'
                  ? 'Publier dans les Coulisses'
                  : 'Enregistrer dans la base de données'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Liste des {tabs.find(t => t.id === activeTab)?.label} ({rows.length})
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Élément</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Détails</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400 italic">
                      Aucun résultat.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id}>
                    {editingId === row.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editDetails}
                            onChange={(e) => setEditDetails(e.target.value)}
                            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button onClick={saveEdit} className="text-green-600 font-semibold hover:bg-green-50 px-3 py-1 rounded-lg">Sauver</button>
                          <button onClick={() => setEditingId(null)} className="ml-2 text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-lg">Annuler</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700 font-medium">{row.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-sm">{row.details}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <button onClick={() => startEdit(row)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" aria-label="Modifier">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg ml-2 transition-colors" aria-label="Supprimer">
                            <Trash2 size={18} />
                          </button>
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
