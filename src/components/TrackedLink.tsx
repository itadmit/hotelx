"use client";

import Link from "next/link";
import { trackCTAClick } from "@/lib/gtag";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  trackLabel: string;
};

export function TrackedLink({ trackLabel, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackCTAClick(trackLabel);
        onClick?.(e);
      }}
    />
  );
}
