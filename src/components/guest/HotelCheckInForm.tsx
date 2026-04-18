"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Key,
  KeyRound,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  hotelSlug: string;
};

export function HotelCheckInForm({ hotelSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  function normalizeRoom(value: string) {
    return value.trim().toUpperCase().replace(/\s+/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedRoomNumber = roomNumber.trim();

    if (trimmedName.length < 2) {
      setError("Please enter your name as it appears on the reservation.");
      return;
    }

    if (trimmedRoomNumber.length === 0) {
      setError("Please enter your room number.");
      return;
    }

    setRoomPassword("");
    setModalError(null);
    setIsPasswordOpen(true);
  }

  async function handlePasswordSubmit() {
    const trimmedName = name.trim();
    const trimmedRoomNumber = roomNumber.trim();
    const trimmedPassword = normalizeRoom(roomPassword);

    if (!trimmedPassword) {
      setModalError("Please enter the room password.");
      return;
    }

    startTransition(async () => {
      try {
        setModalError(null);
        const res = await fetch(`/api/public/check-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hotelSlug,
            roomNumber: trimmedRoomNumber,
            roomCode: trimmedPassword,
            guestName: trimmedName,
          }),
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401) {
            setModalError("Wrong password. Please verify the room card code.");
          } else if (res.status === 404) {
            setModalError("We couldn't find that room number.");
          } else {
            setModalError("Something went wrong. Please try again in a moment.");
          }
          return;
        }

        const data = (await res.json()) as { roomCode: string };

        try {
          window.localStorage.setItem(
            `hotelx:guest:${hotelSlug}`,
            JSON.stringify({
              name: trimmedName,
              roomNumber: trimmedRoomNumber,
              roomCode: data.roomCode,
            })
          );
        } catch {
          // localStorage may be unavailable (private mode) — degrade silently.
        }

        setIsPasswordOpen(false);
        router.push(`/g/${hotelSlug}/${data.roomCode}`);
      } catch {
        setModalError("Network issue. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="guest-name"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55"
        >
          Your name
        </label>
        <div className="mt-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none">
            <User className="h-4 w-4" strokeWidth={2} />
          </span>
          <input
            id="guest-name"
            type="text"
            autoComplete="name"
            placeholder="As on your reservation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-[color:var(--border)] text-ink text-[15px] placeholder:text-foreground/40 focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15 outline-none transition-all disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="guest-room"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55"
        >
          Room number
        </label>
        <div className="mt-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none">
            <KeyRound className="h-4 w-4" strokeWidth={2} />
          </span>
          <input
            id="guest-room"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="e.g. 101"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            disabled={isPending}
            className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-[color:var(--border)] text-ink text-[15px] placeholder:text-foreground/40 focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15 outline-none transition-all disabled:opacity-60 numeral tracking-wider"
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-clay leading-snug" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="group w-full h-12 rounded-xl bg-emerald-brand text-primary-foreground font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-ink transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking…
          </>
        ) : (
          <>
            Enter the concierge
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <p className="flex items-start gap-2 mt-4 text-[12px] text-foreground/55 leading-snug">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand mt-0.5 shrink-0" />
        <span>
          Honor system — we don&apos;t verify identity. Your name only
          personalizes the experience and helps the staff greet you.
        </span>
      </p>

      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Room code</DialogTitle>
            <DialogDescription>
              Two-step verification: enter the code from your in-room card.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-xl border border-[color:var(--border)] bg-surface/70 p-3 space-y-1.5">
              <p className="text-xs font-medium text-ink flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-emerald-brand" />
                Need help with your room code?
              </p>
              <p className="text-xs text-foreground/70">
                The code appears on the card in your room.
              </p>
              <p className="text-xs text-foreground/70">
                Not sure what it is? Call reception and ask.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="room-password"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55"
              >
                Room code
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  id="room-password"
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Enter room code"
                  disabled={isPending}
                  autoFocus
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-card border border-[color:var(--border)] text-ink text-sm placeholder:text-foreground/40 focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15 outline-none transition-all"
                />
              </div>
              {modalError ? (
                <p className="text-xs text-clay leading-snug" role="alert">
                  {modalError}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handlePasswordSubmit} disabled={isPending}>
              {isPending ? "Checking…" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
