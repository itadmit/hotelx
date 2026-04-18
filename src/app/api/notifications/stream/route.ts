import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { staffChannel, subscribe } from "@/lib/notifications/bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  let user;
  try {
    user = await requireSessionUser();
  } catch (err) {
    if (err instanceof ApiAuthError) {
      return new Response(err.message, { status: 401 });
    }
    return new Response("Server error", { status: 500 });
  }

  const encoder = new TextEncoder();
  const channel = staffChannel(user.hotelId!);

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
