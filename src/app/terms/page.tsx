import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — HotelX",
  description:
    "The terms and conditions that govern your use of the HotelX platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
            Terms of{" "}
            <span className="display-italic text-emerald-brand">Service.</span>
          </h1>
          <p className="mt-4 text-foreground/65 text-sm font-mono">
            Last updated · April 2026
          </p>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-2xl">
            Please read these terms carefully before using HotelX. By accessing
            or using the platform, you agree to be bound by these terms.
          </p>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Acceptance of Terms
            </h2>
            <p>
              By creating an account or using HotelX, you confirm that you have
              read, understood, and agree to these Terms of Service. If you are
              using HotelX on behalf of an organization, you represent that you
              have authority to bind that organization to these terms.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Description of Service
            </h2>
            <p>
              HotelX is a QR-based guest concierge platform that enables hotels
              to offer digital service menus, upselling opportunities, and
              intelligent review routing — all from a single dashboard.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Account Registration
            </h2>
            <p>
              You must provide accurate and complete information when creating
              an account. You are responsible for maintaining the security of
              your password and for all activity that occurs under your account.
              Each subscription covers one hotel property.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Subscription &amp; Billing
            </h2>
            <p>
              HotelX offers monthly subscription plans. Every new account begins
              with a 30-day free trial — no credit card required. You may cancel
              your subscription at any time, effective at the end of the current
              billing cycle. We do not offer refunds for partial months.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Send unsolicited messages (spam) through the platform</li>
              <li>
                Scrape, crawl, or otherwise extract data from HotelX by
                automated means
              </li>
              <li>
                Use the platform to distribute illegal, harmful, or offensive
                content
              </li>
              <li>
                Attempt to gain unauthorized access to other accounts or our
                infrastructure
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Intellectual Property
            </h2>
            <p>
              HotelX and its licensors retain all rights to the platform,
              including its design, code, and trademarks. You retain full
              ownership of your content and guest data uploaded to the platform.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Data Processing
            </h2>
            <p>
              The hotel is the data controller for guest data. HotelX acts as
              the data processor and processes guest data solely according to
              the hotel&apos;s instructions. This relationship is governed by our{" "}
              <a href="/dpa" className="text-emerald-brand hover:underline">
                Data Processing Agreement
              </a>
              .
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Uptime &amp; SLA
            </h2>
            <p>
              We target 99.9% uptime for the HotelX platform. Service status is
              available on our public status page. Planned maintenance windows
              are communicated at least 48 hours in advance and are scheduled
              outside peak hours whenever possible.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, HotelX&apos;s total
              liability to you is limited to the amount of fees you have paid in
              the twelve (12) months immediately preceding the event giving rise
              to the claim.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Termination
            </h2>
            <p>
              Either party may terminate the agreement with 30 days&apos;
              written notice. We reserve the right to terminate your account
              immediately if you materially breach these terms. Upon
              termination, your data will be available for export for 30 days,
              after which it will be permanently deleted.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the State of Israel. Any
              disputes arising from these terms shall be resolved exclusively in
              the courts of Tel Aviv-Jaffa, Israel.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Entire Agreement
            </h2>
            <p>
              These Terms of Service, together with our Privacy Policy and Data
              Processing Agreement, constitute the entire agreement between you
              and HotelX regarding your use of the platform.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Contact</h2>
            <p>
              Tadmit Interactive Ltd., Israel.
              <br />
              For legal inquiries, reach us at{" "}
              <a
                href="mailto:legal@hotelx.app"
                className="text-emerald-brand hover:underline"
              >
                legal@hotelx.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
