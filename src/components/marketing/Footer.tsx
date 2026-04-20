import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Live demo", href: "/demo" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "/customers" },
      { label: "Press kit", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Guides", href: "/guides" },
      { label: "Status", href: "/status" },
      { label: "API", href: "/api-docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "DPA", href: "/dpa" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[color:var(--border)] bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative w-9 h-9 rounded-md bg-emerald-brand flex items-center justify-center text-primary-foreground">
                <span className="font-display text-base leading-none">H</span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-brand opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-brand border-2 border-surface" />
                </span>
              </span>
              <span className="font-display text-2xl tracking-tight text-ink">
                Hotel<span className="text-emerald-brand">X</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-foreground/70">
              The Concierge Operating System. Software that whispers, service
              that resonates.
            </p>
            <p className="mt-8 eyebrow">
              Made with care · Tel Aviv ↔ Lisbon
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-brand">
                  {c.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-foreground/70 hover:text-ink transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[color:var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-foreground/60">
            © {new Date().getFullYear()} HotelX — All rights reserved.
          </p>
          <p className="eyebrow">
            v2.0 · status:{" "}
            <span className="text-emerald-brand">all systems nominal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
