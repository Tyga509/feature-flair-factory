import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("samayoo-theme") as "light" | "dark" | null;
    const initial: "light" | "dark" =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("samayoo-theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2.5 rounded-full hover:bg-secondary transition-colors group"
      aria-label="Basculer thème clair/sombre"
      suppressHydrationWarning
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
