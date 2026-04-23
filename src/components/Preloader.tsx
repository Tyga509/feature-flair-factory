import { Flower } from 'lucide-react'

export function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Effet de lueur derrière la fleur */}
      <div className="absolute w-32 h-32 bg-green-200 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Icône de fleur animée */}
      <div className="relative animate-bounce">
        <Flower size={64} className="text-green-600 animate-[spin_3s_linear_infinite]" />
      </div>

      {/* Texte de chargement */}
      <h2 className="mt-6 text-xl font-bold text-gray-800 tracking-widest uppercase">
        Samayoo Flowers
      </h2>
      <div className="mt-2 flex gap-1">
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  )
}