import { createFileRoute, redirect } from "@tanstack/react-router";

// Page Artisanat fusionnée dans /boutique — redirige proprement.
export const Route = createFileRoute("/artisanat")({
  beforeLoad: () => {
    throw redirect({ to: "/boutique" });
  },
  component: () => null,
});
