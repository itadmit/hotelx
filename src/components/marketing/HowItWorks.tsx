import { ScanLine, Bell, LineChart } from "lucide-react";

const steps = [
  {
    no: "01",
    icon: ScanLine,
    accent: "bg-amber-soft text-amber-brand",
    title: "Guest scans the QR",
    sub: "No app, no friction",
    description:
      "A small card on the nightstand opens your branded micro-app, already in their language. Zero downloads, zero logins.",
  },
  {
    no: "02",
    icon: Bell,
    accent: "bg-emerald-soft text-emerald-brand",
    title: "Reception responds",
    sub: "Live request board",
    description:
      "Orders and questions land on a Kanban sorted by SLA. Assign with one tap, the guest sees a status update automatically.",
  },
  {
    no: "03",
    icon: LineChart,
    accent: "bg-[#f3d8cf] text-clay",
    title: "Marketing sees the numbers",
    sub: "ROI in plain English",
    description:
      "Revenue per room, top sellers, response times, Booking score \u2014 a weekly digest your GM can read in 90 seconds.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="relative py-20 sm:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <span className="pill">
              <ScanLine className="h-3 w-3 text-emerald-brand" />
              How it works
            </span>
            <h2
              id="how-heading"
              className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight max-w-2xl leading-[1.05] text-ink"
            >
              From <span className="display-italic text-emerald-brand">scan</span>{" "}
              to{" "}
              <span className="display-italic text-amber-brand">served</span>{" "}
              &mdash; in 90 seconds.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end">
            <p className="text-foreground/70 max-w-md">
              No PMS rip-and-replace, no IT project, no app on the App Store.
              Print a QR, train your team in an afternoon, you&rsquo;re live.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((s) => (
            <article
              key={s.no}
              className="card-surface p-7 flex flex-col h-full"
            >
              <div className="flex items-center justify-between">
                <span className="numeral text-3xl text-foreground/30">{s.no}</span>
                <span className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${s.accent}`}>
                  <s.icon className="h-5 w-5" />
                </span>
              </div>

              <h3 className="mt-8 font-display text-2xl text-ink">{s.title}</h3>
              <p className="mt-1 eyebrow">{s.sub}</p>
              <p className="mt-4 text-sm text-foreground/70 leading-relaxed">
                {s.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
