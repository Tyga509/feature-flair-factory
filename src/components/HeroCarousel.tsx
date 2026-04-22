import { useEffect, useState } from "react";
import heroSpring from "@/assets/hero-spring-break.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.jpg";
import hero7 from "@/assets/hero-7.jpg";
import hero8 from "@/assets/hero-8.jpg";
import hero9 from "@/assets/hero-9.jpg";
import hero10 from "@/assets/hero-10.jpg";
import hero11 from "@/assets/hero-11.jpg";
import hero12 from "@/assets/hero-12.jpg";
import hero13 from "@/assets/hero-13.jpg";
import hero14 from "@/assets/hero-14.jpg";
import hero15 from "@/assets/hero-15.jpg";
import hero16 from "@/assets/hero-16.jpg";
import hero17 from "@/assets/hero-17.jpg";
import hero18 from "@/assets/hero-18.jpg";
import hero19 from "@/assets/hero-19.jpg";
import hero20 from "@/assets/hero-20.jpg";
import hero21 from "@/assets/hero-21.jpg";
import hero22 from "@/assets/hero-22.jpg";
import hero23 from "@/assets/hero-23.jpg";
import hero24 from "@/assets/hero-24.jpg";
import hero25 from "@/assets/hero-25.jpg";
import hero26 from "@/assets/hero-26.jpg";
import hero27 from "@/assets/hero-27.jpg";
import hero28 from "@/assets/hero-28.jpg";
import hero29 from "@/assets/hero-29.jpg";
import hero30 from "@/assets/hero-30.jpg";
import hero31 from "@/assets/hero-31.jpg";
import hero32 from "@/assets/hero-32.jpg";
import hero33 from "@/assets/hero-33.jpg";

const slides = [
  { src: heroSpring, alt: "Spring Break — Des fleurs spéciales pour des mères spéciales" },
  { src: hero1, alt: "Boutique de roses élégantes" },
  { src: hero2, alt: "Bouquet de pivoines pastel" },
  { src: hero3, alt: "Composition de mariage romantique" },
  { src: hero4, alt: "Boutique florale luxueuse" },
  { src: hero5, alt: "Pivoines roses sur marbre" },
  { src: hero6, alt: "Roses blanches de mariage" },
  { src: hero7, alt: "Roses rouges et bougies" },
  { src: hero8, alt: "Fleuriste composant un bouquet" },
  { src: hero9, alt: "Pétales sur soie" },
  { src: hero10, alt: "Renoncules et roses pastel" },
  { src: hero11, alt: "Bouquet au coucher du soleil" },
  { src: hero12, alt: "Boîte luxe de roses rouges" },
  { src: hero13, alt: "Roses cascade pastel" },
  { src: hero14, alt: "Bouquet en cœur de roses" },
  { src: hero15, alt: "Hortensias et roses pastel" },
  { src: hero16, alt: "Comptoir de fleuriste" },
  { src: hero17, alt: "Bouquet luxe romantique" },
  { src: hero18, alt: "Roses roses et blanches" },
  { src: hero19, alt: "Pétales et bougies" },
  { src: hero20, alt: "Bouquet de mariage ivoire" },
  { src: hero21, alt: "Roses bordeaux luxe" },
  { src: hero22, alt: "Roses pêche sur marbre" },
  { src: hero23, alt: "Installation florale mariage" },
  { src: hero24, alt: "Rose rouge minimaliste" },
  { src: hero25, alt: "Bouquet artisan de roses" },
  { src: hero26, alt: "Bouquet pastel rêveur" },
  { src: hero27, alt: "Table d'anniversaire romantique" },
  { src: hero28, alt: "Coffret de roses cadeau" },
  { src: hero29, alt: "Mur floral de roses" },
  { src: hero30, alt: "Bouquet au coucher du soleil" },
  { src: hero31, alt: "Vase cristal de roses" },
  { src: hero32, alt: "Femme tenant un bouquet" },
  { src: hero33, alt: "Roses rouges avec pétales" },
];

export function HeroCarousel({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          width={1920}
          height={1080}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl text-ivory animate-fade-in">{children}</div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 max-w-[90%] flex-wrap justify-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-accent" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
