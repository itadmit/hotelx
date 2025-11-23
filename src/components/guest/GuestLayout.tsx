import { Logo } from "@/components/Logo";

interface GuestLayoutProps {
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export function GuestLayout({ children, actionButton }: GuestLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

