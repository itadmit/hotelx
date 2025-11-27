"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo size="md" href="/" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile Menu Button with Animation */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative p-2 text-slate-700 hover:text-blue-600 transition-colors active:scale-95"
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Menu 
              className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`} 
            />
            <X 
              className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
              }`} 
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu with Slide Animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 pb-6 space-y-1">
          {/* Navigation Links */}
          <Link 
            href="/features" 
            className="group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all mx-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Features</span>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link 
            href="/pricing" 
            className="group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all mx-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Pricing</span>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link 
            href="/about" 
            className="group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all mx-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>About</span>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
          
          {/* Language Switcher */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Language</p>
            <LanguageSwitcher />
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
          
          {/* Login Button */}
          <Link 
            href="/login" 
            className="flex items-center justify-center px-4 py-3 mx-2 rounded-xl text-base font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          
          {/* CTA Button */}
          <Link 
            href="/signup" 
            className="flex items-center justify-center px-6 py-4 mx-2 mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-base font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 active:scale-95"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Free Trial
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

