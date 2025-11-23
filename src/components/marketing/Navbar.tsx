import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";

export function Navbar() {
  return (
    <header className="w-full py-4 px-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo size="md" href="/" />

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-primary">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
}

