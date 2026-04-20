import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Data Processing Agreement — HotelX",
  description:
    "The Data Processing Agreement governing how HotelX processes personal data on behalf of hotels.",
};

export default function DpaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
            Data Processing{" "}
            <span className="display-italic text-emerald-brand">
              Agreement.
            </span>
          </h1>
          <p className="mt-4 text-foreground/65 text-sm font-mono">
            Last updated · April 2026
          </p>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-2xl">
            This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of
            the agreement between Tadmit Interactive Ltd.
            (&ldquo;HotelX&rdquo;, &ldquo;Processor&rdquo;) and you
            (&ldquo;Hotel&rdquo;, &ldquo;Controller&rdquo;).
          </p>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Definitions
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-ink">Controller</strong> — the hotel
                entity that determines the purposes and means of processing
                personal data.
              </li>
              <li>
                <strong className="text-ink">Processor</strong> — HotelX
                (Tadmit Interactive Ltd.), which processes personal data on
                behalf of the Controller.
              </li>
              <li>
                <strong className="text-ink">Sub-processor</strong> — a third
                party engaged by HotelX to assist in processing personal data.
              </li>
              <li>
                <strong className="text-ink">Personal Data</strong> — any
                information relating to an identified or identifiable natural
                person.
              </li>
              <li>
                <strong className="text-ink">Processing</strong> — any
                operation performed on personal data, including collection,
                storage, retrieval, use, and erasure.
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Scope</h2>
            <p>
              This DPA applies to all personal data that HotelX processes on
              behalf of the hotel through the HotelX platform. HotelX processes
              guest data solely to provide the concierge service as instructed
              by the hotel.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Processing Details
            </h2>
            <div className="card-surface p-5 sm:p-6 space-y-4 mt-4">
              <div>
                <p className="eyebrow mb-1">Categories of Data</p>
                <p>
                  Guest names, room numbers, service requests, feedback ratings,
                  language preferences, and interaction timestamps.
                </p>
              </div>
              <div className="border-t border-[color:var(--border)] pt-4">
                <p className="eyebrow mb-1">Purpose of Processing</p>
                <p>
                  To provide the QR-based digital concierge service, process
                  service requests, and collect guest feedback.
                </p>
              </div>
              <div className="border-t border-[color:var(--border)] pt-4">
                <p className="eyebrow mb-1">Duration</p>
                <p>
                  For the duration of the service agreement between HotelX and
                  the hotel. Data is deleted within 30 days of agreement
                  termination.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Obligations of the Processor
            </h2>
            <p>HotelX shall:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Process personal data only on documented instructions from the
                hotel
              </li>
              <li>
                Ensure that all personnel authorized to process personal data
                are bound by confidentiality obligations
              </li>
              <li>
                Implement appropriate technical and organizational security
                measures
              </li>
              <li>
                Assist the hotel in responding to data subject access requests
              </li>
              <li>
                Delete or return all personal data upon termination of the
                agreement, at the hotel&apos;s choice
              </li>
              <li>
                Make available all information necessary to demonstrate
                compliance with this DPA
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Sub-processors
            </h2>
            <p>
              HotelX uses the following sub-processors to deliver the service.
              We will notify you at least 30 days before adding a new
              sub-processor:
            </p>
            <div className="card-surface p-5 sm:p-6 mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border)]">
                    <th className="text-left py-2 eyebrow">Provider</th>
                    <th className="text-left py-2 eyebrow">Purpose</th>
                    <th className="text-left py-2 eyebrow">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--border)]">
                  <tr>
                    <td className="py-3 text-ink font-medium">
                      <a
                        href="https://aws.amazon.com"
                        className="text-emerald-brand hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        AWS
                      </a>
                    </td>
                    <td className="py-3">Cloud infrastructure &amp; storage</td>
                    <td className="py-3 font-mono text-xs">eu-central-1</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-ink font-medium">
                      <a
                        href="https://resend.com"
                        className="text-emerald-brand hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resend
                      </a>
                    </td>
                    <td className="py-3">Transactional email delivery</td>
                    <td className="py-3 font-mono text-xs">US / EU</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-ink font-medium">
                      <a
                        href="https://vercel.com"
                        className="text-emerald-brand hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Vercel
                      </a>
                    </td>
                    <td className="py-3">Application deployment</td>
                    <td className="py-3 font-mono text-xs">EU (fra1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Security Measures
            </h2>
            <p>
              HotelX implements the following security measures to protect
              personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>AES-256 encryption at rest, TLS 1.3 in transit</li>
              <li>
                VPC network isolation with private subnets and security groups
              </li>
              <li>Automated backups every 6 hours with point-in-time recovery</li>
              <li>Role-based access control and audit logging</li>
              <li>Regular penetration testing by independent third parties</li>
              <li>SOC 2 Type II aligned practices</li>
            </ul>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Data Breach Notification
            </h2>
            <p>
              In the event of a personal data breach, HotelX will notify the
              hotel without undue delay and no later than 72 hours after
              becoming aware of the breach. The notification will include the
              nature of the breach, categories of data affected, approximate
              number of data subjects, and measures taken to address the breach.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Data Subject Rights
            </h2>
            <p>
              HotelX will assist the hotel in fulfilling its obligations to
              respond to data subject requests (access, rectification, erasure,
              portability, and objection) within the timeframes required by
              applicable law.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              International Transfers
            </h2>
            <p>
              Personal data is stored and processed within the EU. Where
              transfers outside the European Economic Area are necessary,
              HotelX ensures appropriate safeguards are in place, including EU
              Standard Contractual Clauses (SCCs).
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Audit Rights
            </h2>
            <p>
              The hotel may audit HotelX&apos;s compliance with this DPA once
              per calendar year, with at least 30 days&apos; prior written
              notice. Audits shall be conducted during normal business hours and
              shall not unreasonably interfere with HotelX&apos;s operations.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">
              Term &amp; Termination
            </h2>
            <p>
              This DPA is effective for the duration of the service agreement.
              Upon termination, HotelX will delete all personal data within 30
              days unless legally required to retain it. The hotel may request a
              data export in a machine-readable format before deletion.
            </p>
          </section>

          <section className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
            <h2 className="text-xl font-display text-ink mt-10">Contact</h2>
            <p>
              Tadmit Interactive Ltd., Israel.
              <br />
              For DPA inquiries, reach us at{" "}
              <a
                href="mailto:dpa@hotelx.app"
                className="text-emerald-brand hover:underline"
              >
                dpa@hotelx.app
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
