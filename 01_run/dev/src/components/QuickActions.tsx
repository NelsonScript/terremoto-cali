import Link from "next/link";

const ACTIONS = [
  { href: "/donar", label: "Donar", icon: "🤝" },
  { href: "/albergues", label: "Albergues", icon: "🏠" },
  { href: "/reportar", label: "Reportar", icon: "📣" },
  { href: "/lineas-de-emergencia", label: "Emergencia", icon: "☎" },
];

export default function QuickActions() {
  return (
    <>
      {/* Barra fija inferior en móvil: las 4 acciones más urgentes a 1 tap */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-4">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col items-center justify-center py-2 text-xs text-slate-700 active:bg-slate-100"
          >
            <span className="text-lg leading-none">{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </nav>
      {/* Espaciador para que el contenido no quede oculto tras la barra fija */}
      <div className="md:hidden h-14" aria-hidden />
    </>
  );
}
