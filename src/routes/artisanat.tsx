import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

// Page Artisanat fusionnée dans /boutique?cat=Artisanat — redirige.
export const Route = createFileRoute("/artisanat")({
  component: () => <Navigate to="/boutique" replace />,
});
