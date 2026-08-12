import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuickActions from "@/components/QuickActions";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ayuda Suroccidente — Respuesta al terremoto del 10 de agosto de 2026",
    template: "%s · Ayuda Suroccidente",
  },
  description:
    "Información verificada y herramientas de acción para la emergencia por el sismo del 10 de agosto de 2026 en el suroccidente colombiano (Valle del Cauca, Risaralda, Chocó, Caldas y departamentos vecinos): dónde donar, albergues, líneas de emergencia y cómo reportar.",
};

export const viewport: Viewport = {
  themeColor: "#111312",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <QuickActions />
      </body>
    </html>
  );
}
