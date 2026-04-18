/**
 * Minimal SSE consumer that works with fetch + POST + cookies.
 *
 * The native EventSource API can only do GET without credentials in
 * cross-origin scenarios and refuses POST. Our progress endpoints stream
 * `event: name\ndata: {json}\n\n` blocks the same way, so we parse them
 * manually and call `onEvent` for each one.
 */
export async function consumeSseFetch(
  url: string,
  init: RequestInit | undefined,
  onEvent: (event: string, data: unknown) => void,
): Promise<void> {
  const res = await fetch(url, init);
  if (!res.body) {
    throw new Error("Streaming not supported by this server response.");
  }
  if (!res.ok && res.headers.get("content-type")?.includes("application/json")) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.detail ?? json?.error ?? "Request failed");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // SSE blocks are separated by "\n\n". Each block can have multiple
  // `event:` and `data:` lines; spec says concat data lines with \n.
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let separatorIndex: number;
    while ((separatorIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawBlock = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);

      let eventName = "message";
      const dataLines: string[] = [];
      for (const line of rawBlock.split("\n")) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trim());
        }
        // Comments (":...") and other fields are ignored.
      }
      if (dataLines.length === 0) continue;
      const dataString = dataLines.join("\n");
      let parsed: unknown;
      try {
        parsed = JSON.parse(dataString);
      } catch {
        parsed = dataString;
      }
      onEvent(eventName, parsed);
    }
  }
}
