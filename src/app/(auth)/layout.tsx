import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 md:p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 pb-20">
        {children}
      </div>
    </div>
  );
}

