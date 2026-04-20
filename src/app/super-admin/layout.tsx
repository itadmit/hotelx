import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { isSuperAdmin } from "@/lib/server-auth";
import Link from "next/link";
import { LayoutDashboard, Mail, ArrowLeft } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email || !isSuperAdmin(session.user.email)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[color:var(--border)] bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-foreground/50 hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 rounded-md bg-emerald-brand items-center justify-center text-primary-foreground">
                <span className="font-display text-xs leading-none">H</span>
              </span>
              <span className="font-display text-lg tracking-tight text-ink">
                Super Admin
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              href="/super-admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-foreground/70 hover:text-ink hover:bg-card transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Overview
            </Link>
            <Link
              href="/super-admin/email-template"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-foreground/70 hover:text-ink hover:bg-card transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              Welcome Email
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
