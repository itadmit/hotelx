"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setSubmitted(true);
  }

  if (!token) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight font-heading">
            Invalid Reset Link
          </h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button className="w-full">Request New Link</Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight font-heading">
            Password Reset Successful
          </h1>
          <p className="text-sm text-muted-foreground">
            Your password has been reset. You can now login with your new password.
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full">Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight font-heading">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        <Button disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </div>
  );
}

