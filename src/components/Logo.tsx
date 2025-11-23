import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showTagline?: boolean;
  showIcon?: boolean;
}

export function Logo({ 
  variant = "default", 
  size = "md",
  href = "/",
  className,
  showTagline = false,
  showIcon = false 
}: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const iconSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const content = (
    <div className={cn("relative inline-flex items-center gap-1 group", className)}>
      {/* אייקון מלון אופציונלי */}
      {showIcon && (
        <div className="relative mr-1">
          <svg 
            className={cn(
              iconSizeClasses[size],
              "transition-all duration-300 group-hover:scale-110"
            )}
            viewBox="0 0 24 24" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* בניין מלון */}
            <path 
              d="M3 21V9L12 3L21 9V21H14V15H10V21H3Z" 
              fill="url(#icon-gradient)"
              className="transition-all duration-300"
            />
            {/* חלונות */}
            <rect x="6" y="11" width="2" height="2" fill="white" opacity="0.8" />
            <rect x="11" y="11" width="2" height="2" fill="white" opacity="0.8" />
            <rect x="16" y="11" width="2" height="2" fill="white" opacity="0.8" />
            {/* כוכב */}
            <path 
              d="M12 1L13.5 5.5L18 6L14.5 9.5L15.5 14L12 11.5L8.5 14L9.5 9.5L6 6L10.5 5.5L12 1Z" 
              fill="#FFD700"
              className="group-hover:scale-110 transition-transform duration-300 origin-center"
            />
            <defs>
              <linearGradient id="icon-gradient" x1="3" y1="3" x2="21" y2="21">
                <stop offset="0%" stopColor="#4f39f6" />
                <stop offset="100%" stopColor="#4f39f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
      
      <div className="relative">
        <span className={cn(
          "font-black tracking-tight transition-all duration-300",
          sizeClasses[size],
          variant === "light" ? "text-white" : "text-gray-900"
        )}>
          Hotel
        </span>
        
        {/* קו דקורטיבי מתחת */}
        <svg 
          className="absolute -bottom-1 left-0 w-full h-1.5 overflow-visible"
          viewBox="0 0 100 6" 
          fill="none"
          preserveAspectRatio="none"
        >
          <path 
            d="M 0 3 Q 25 0, 50 3 T 100 3" 
            stroke="url(#gradient)" 
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-300 group-hover:stroke-[3]"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f39f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#4f39f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f39f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* האות X עם צבע מוצק */}
      <span className="relative">
        <span 
          className={cn(
            "font-black tracking-tight transition-all duration-500 group-hover:scale-105",
            sizeClasses[size]
          )}
          style={{ color: '#4f39f6' }}
        >
          X
        </span>
        
        {/* אפקט זוהר מאחורי ה-X */}
        <span 
          className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{ color: '#4f39f6' }}
          aria-hidden="true"
        >
          X
        </span>
      </span>
      
      {/* תג קטן "Guest Experience" - מותנה */}
      {showTagline && (
        <div className="absolute -bottom-5 left-0 text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
          Guest Experience
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

