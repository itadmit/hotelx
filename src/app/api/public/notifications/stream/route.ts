import { guestChannel, subscribe } from "@/lib/notifications/bus";
import { resolveGuestScope } from "@/lib/notifications/guest-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = await resolveGuestScope(
    searchParams.get("hotelSlug"),
    searchParams.get("roomCode")
  );

  if (!scope) {
    return new Response("Room not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  const channel = guestChannel(scope.roomId);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const safeEnqueue = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };

      safeEnqueue(`retry: 5000\n\n`);
      safeEnqueue(`event: ready\ndata: {"ok":true}\n\n`);

      const unsubscribe = subscribe(channel, (notification) => {
        safeEnqueue(
          `event: notification\ndata: ${JSON.stringify(notification)}\n\n`
        );
      });

      const keepAlive = setInterval(() => {
        safeEnqueue(`: keep-alive ${Date.now()}\n\n`);
      }, 25_000);

      const cleanup = () => {
        closed = true;
        clearInterval(keepAlive);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
