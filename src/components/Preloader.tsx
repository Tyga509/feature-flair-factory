import { useEffect, useState } from 'react'
import logo from '@/assets/logo.png'

export function Preloader() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || !visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background animate-fade-out">
      {/* Lueur derrière le logo */}
      <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />

      {/* Logo avec pulsation */}
      <div className="relative animate-pulse">
        <img
          src={logo}
          alt="Samayoo Flowers"
          className="w-32 h-32 object-contain drop-shadow-xl"
        />
      </div>

      {/* Nom de la marque */}
      <h2 className="mt-6 font-display text-2xl font-bold text-foreground tracking-[0.3em] uppercase">
        Samayoo Flowers
      </h2>

      {/* Points de chargement */}
      <div className="mt-4 flex gap-1.5">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  )
}
