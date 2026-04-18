import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  ArrowUpRight,
  PlayCircle,
  Smartphone,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { DemoBookingForm } from "./DemoBookingForm";

async function pickDemoTarget() {
  const room = await prisma.room.findFirst({
    where: { code: "R101" },
    select: {
      code: true,
      number: true,
      hotel: { select: { slug: true, name: true } },
    },
  });

  if (room?.hotel?.slug) {
    return {
      hotelSlug: room.hotel.slug,
      hotelName: room.hotel.name,
      roomCode: room.code,
      roomNumber: room.number,
    };
  }

  return null;
}

export default async function DemoPage() {
  const target = await pickDemoTarget();
  const demoUrl = target ? `/g/${target.hotelSlug}/${target.roomCode}` : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero / Try-now section */}
      <section className="relative overflow-hidden bg-wash">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Copy */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <span className="pill">
                <PlayCircle className="h-3 w-3" />
                Live demo · no signup
              </span>
              <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-6xl mt-5 leading-[1.02] tracking-tight text-ink">
                Try the guest
                <br />
                <span className="display-italic text-emerald-brand">
                  experience
                </span>{" "}
                now.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Tap around inside a real iPhone preview. Browse categories,
                request a service — it&apos;s the actual app your guests get
                when they scan the QR code.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                {demoUrl ? (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center justify-center gap-2 h-12 pl-6 pr-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
                  >
                    Open in new tab
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                <Link
                  href="#book-demo"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[color:var(--border)] bg-card text-ink font-medium hover:bg-surface transition-colors"
                >
                  Book a private demo
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 eyebrow justify-center lg:justify-start">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-3 w-3 text-emerald-brand" />
                  Real backend
                </span>
                <span className="text-foreground/30">·</span>
                <span>Live data</span>
                <span className="text-foreground/30">·</span>
                <span>Resets daily</span>
              </div>
            </div>

            {/* iPhone stage */}
            <div className="lg:col-span-7 flex justify-center">
              {demoUrl && target ? (
                <DemoPhoneStage
                  demoUrl={demoUrl}
                  hotelName={target.hotelName}
                  roomNumber={target.roomNumber}
                />
              ) : (
                <DemoUnavailable />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Book a demo */}
      <section id="book-demo" className="py-16 sm:py-24 bg-background border-t border-[color:var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="eyebrow">Talk to us</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink">
              Book a private demo.
            </h2>
            <p className="mt-3 text-foreground/65 max-w-xl mx-auto">
              30 minutes with our team — we&apos;ll tailor a walkthrough to
              your hotel and answer your questions.
            </p>
          </div>

          <DemoBookingForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* =====================================================
   iPhone stage with embedded guest app (real route)
   ===================================================== */
function DemoPhoneStage({
  demoUrl,
  hotelName,
  roomNumber,
}: {
  demoUrl: string;
  hotelName: string;
  roomNumber: string;
}) {
  return (
    <div className="relative">
      {/* Decorative halos */}
      <div className="absolute top-6 -left-8 h-36 w-36 rounded-3xl bg-amber-soft -z-10 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-emerald-soft -z-10 blur-2xl" />

      {/* Caption above */}
      <div className="text-center mb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
          {hotelName} · Room {roomNumber}
        </p>
      </div>

      {/* iPhone titanium frame (matches Hero mockup) */}
      <div className="relative mx-auto" style={{ width: 360 }}>
        {/* Side buttons — left */}
        <span className="absolute left-[-3px] top-[110px] h-10 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />
        <span className="absolute left-[-3px] top-[170px] h-16 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />
        <span className="absolute left-[-3px] top-[250px] h-16 w-[3px] rounded-l-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />
        {/* Side buttons — right */}
        <span className="absolute right-[-3px] top-[150px] h-20 w-[3px] rounded-r-sm bg-gradient-to-b from-[#3a4742] to-[#1a2420] z-10" />

        <div className="rounded-[58px] p-[3px] bg-gradient-to-br from-[#5a6661] via-[#3a4742] to-[#1a2420] shadow-[0_60px_120px_-30px_rgba(21,32,28,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
          <div className="rounded-[55px] p-[6px] bg-ink">
            <div className="relative w-[348px] h-[720px] rounded-[50px] overflow-hidden bg-background">
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-[28px] w-[110px] rounded-full bg-ink z-30 flex items-center justify-end pr-3 pointer-events-none">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1a2a26] ring-1 ring-[#0a1310]" />
              </div>

              {/* The actual guest experience */}
              <iframe
                src={demoUrl}
                title="HotelX guest demo"
                className="absolute inset-0 w-full h-full border-0 bg-background"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Reload button — overlay */}
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 mx-auto flex items-center justify-center gap-1.5 text-xs text-foreground/55 hover:text-emerald-brand transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Open full screen
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function DemoUnavailable() {
  return (
    <div className="card-elev p-8 max-w-md text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-soft text-amber-brand mb-4">
        <Smartphone className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl text-ink">Demo not provisioned yet</h3>
      <p className="mt-2 text-sm text-foreground/65">
        We couldn&apos;t find a demo room (R101) in the database. Sign up and
        seed demo data from the dashboard, then come back here.
      </p>
      <Link
        href="/signup"
        className="mt-6 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
      >
        Create your account
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
