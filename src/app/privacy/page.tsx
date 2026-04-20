import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — HotelX",
  description:
    "How HotelX collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
            Privacy{" "}
            <span className="display-italic text-emerald-brand">Policy.</span>
          </h1>
          <p className="mt-4 text-foreground/65 text-sm font-mono">
            Last updated · April 2026
          </p>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-2xl">
            Your privacy matters to us. This policy explains what data we
            collect, why we collect it, and how we keep it safe.
          </p>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Information We Collect
            </h2>
            <p>
              <strong className="text-ink">Account data.</strong> When you
              create an account we collect your name, email address, hotel name,
              and billing information.
            </p>
            <p>
              <strong className="text-ink">Usage data.</strong> We automatically
              collect information about how you interact with the platform —
              pages visited, features used, timestamps, device type, and browser
              version.
            </p>
            <p>
              <strong className="text-ink">Guest interaction data.</strong> When
              guests use the QR-based concierge, we process service requests,
              feedback ratings, and language preferences on behalf of your hotel.
            </p>
            <p>
              <strong className="text-ink">Cookies.</strong> We use strictly
              necessary cookies for authentication and session management, plus
              optional analytics cookies (only with your consent).
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              How We Use Your Data
            </h2>
            <p>
              We use the information we collect to provide, maintain, and improve
              the HotelX service; to communicate important updates about your
              account; and to comply with applicable legal obligations.
            </p>
            <p>
              We never use guest data for our own marketing. Guest data is
              processed solely to deliver the concierge service on behalf of
              your hotel.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Data Sharing
            </h2>
            <p>
              We do not sell your personal information. Period. We share data
              only with service providers that are strictly necessary to operate
              the platform:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-ink">Hosting:</strong> AWS
                (eu-central-1)
              </li>
              <li>
                <strong className="text-ink">Payment processing:</strong>{" "}
                Stripe
              </li>
              <li>
                <strong className="text-ink">Email delivery:</strong> Resend
              </li>
              <li>
                <strong className="text-ink">Deployment:</strong> Vercel
              </li>
            </ul>
            <p>
              Each provider is bound by a Data Processing Agreement and
              processes data only on our instructions.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Data Retention
            </h2>
            <p>
              We retain your account data for as long as your account is active.
              If you request deletion, we will remove your personal data within
              30 days, except where we are legally required to retain it.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Guest Data</h2>
            <p>
              Guest data is processed on behalf of the hotel. The hotel acts as
              the <strong className="text-ink">data controller</strong> and
              HotelX acts as the{" "}
              <strong className="text-ink">data processor</strong>. Our
              responsibilities are governed by a Data Processing Agreement (DPA)
              between HotelX and each hotel.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Security</h2>
            <p>
              We implement industry-standard security measures including
              encryption at rest (AES-256) and in transit (TLS 1.3), SOC 2 Type
              II aligned practices, and regular penetration testing by
              independent third parties.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Your Rights
            </h2>
            <p>
              Under the GDPR and applicable data protection laws, you have the
              right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>
                Export your data in a portable format (data portability)
              </li>
              <li>Object to processing based on legitimate interests</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@hotelx.app"
                className="text-emerald-brand hover:underline"
              >
                privacy@hotelx.app
              </a>
              .
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Children</h2>
            <p>
              HotelX is not directed at children under the age of 16. We do not
              knowingly collect personal information from children. If we become
              aware that we have collected data from a child under 16, we will
              delete it promptly.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              International Transfers
            </h2>
            <p>
              Your data is stored in the European Union (AWS eu-central-1,
              Frankfurt). Where transfers outside the EU are necessary, we rely
              on EU Standard Contractual Clauses to ensure an adequate level of
              protection.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Changes to This Policy
            </h2>
            <p>
              We will notify you via email at least 30 days before any material
              changes to this Privacy Policy take effect. Non-material changes
              may be posted directly on this page.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Contact</h2>
            <p>
              Tadmit Interactive Ltd., Israel.
              <br />
              For privacy inquiries, reach us at{" "}
              <a
                href="mailto:privacy@hotelx.app"
                className="text-emerald-brand hover:underline"
              >
                privacy@hotelx.app
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
