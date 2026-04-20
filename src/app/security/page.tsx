import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import {
  Shield,
  Lock,
  Server,
  Eye,
  FileCheck,
  UserCheck,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Security — HotelX",
  description:
    "How HotelX protects your data with enterprise-grade encryption, compliance, and infrastructure.",
};

const features = [
  {
    icon: Shield,
    title: "Encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 in transit. Every byte of data is protected, whether it's moving or stored.",
  },
  {
    icon: Lock,
    title: "Authentication",
    description:
      "Passwords hashed with bcrypt, secure session tokens with automatic rotation, and optional two-factor authentication.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "Hosted on AWS eu-central-1 (Frankfurt) with VPC isolation, private subnets, and automated backups every 6 hours.",
  },
  {
    icon: Eye,
    title: "Monitoring",
    description:
      "24/7 uptime monitoring with anomaly detection. Our incident response team is on-call and responds within 1 hour.",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    description:
      "Fully GDPR compliant. SOC 2 Type II aligned practices. Regular third-party audits validate our security controls.",
  },
  {
    icon: UserCheck,
    title: "Access Control",
    description:
      "Role-based access with the principle of least privilege. Every action is logged in a tamper-proof audit trail.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="eyebrow">Security</span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink">
              Your data is{" "}
              <span className="display-italic text-emerald-brand">
                safe with us.
              </span>
            </h1>
            <p className="mt-5 text-foreground/70 leading-relaxed max-w-2xl">
              Security is not an afterthought — it&apos;s the foundation
              everything at HotelX is built on. We protect hotel and guest data
              with the same rigor you&apos;d expect from a financial
              institution.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card-surface p-5 sm:p-6">
                  <span className="inline-flex h-9 w-9 rounded-lg bg-emerald-soft text-emerald-brand items-center justify-center">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-lg text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>

          <section className="mt-16 card-surface p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-9 w-9 rounded-lg bg-amber-soft text-amber-brand items-center justify-center shrink-0">
                <Mail className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-display text-xl text-ink">
                  Responsible Disclosure
                </h2>
                <p className="mt-2 text-foreground/70 leading-relaxed">
                  Found a vulnerability? We appreciate responsible disclosure.
                  Please report security issues to{" "}
                  <a
                    href="mailto:security@hotelx.app"
                    className="text-emerald-brand hover:underline"
                  >
                    security@hotelx.app
                  </a>
                  . We commit to acknowledging reports within 24 hours and
                  providing a resolution timeline within 72 hours.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10 text-center">
            <p className="text-foreground/65">
              Have questions about our security practices?{" "}
              <a
                href="/demo"
                className="text-emerald-brand hover:underline"
              >
                Get in touch
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
