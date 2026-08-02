// Request-body size caps for the paid/abuse-prone routes. The rate limiter bounds how MANY
// requests an identity makes; this bounds how BIG each one is — the other half of cost control,
// since a single oversized chat payload is forwarded to OpenAI and billed by input size. Caps are
// enforced app-side (not just at a proxy) so they hold on both the droplet and App Platform.
import { NextRequest, NextResponse } from 'next/server';

const KB = 1024;

/** Per-route byte ceilings. All are far above any legitimate request. */
export const BODY_LIMITS = {
  chat: 256 * KB, // a long conversation history, but not a megabyte of injected text
  plan: 16 * KB,
  media: 8 * KB,
  telemetry: 16 * KB,
} as const;

function tooLarge(maxBytes: number): NextResponse {
  return NextResponse.json(
    { error: `Request body too large (max ${Math.floor(maxBytes / KB)} KB).` },
    { status: 413 }
  );
}

/**
 * Read + JSON-parse a request body, rejecting anything over `maxBytes`. Checks Content-Length first
 * (fast reject before reading), then the actual decoded size (Content-Length can lie / be absent).
 * Returns either the parsed data or a Response the caller should return as-is.
 */
export async function readJsonLimited<T = unknown>(
  req: NextRequest,
  maxBytes: number
): Promise<{ ok: true; data: T } | { ok: false; res: NextResponse }> {
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared && declared > maxBytes) return { ok: false, res: tooLarge(maxBytes) };

  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, res: NextResponse.json({ error: 'Invalid body' }, { status: 400 }) };
  }
  if (Buffer.byteLength(text, 'utf8') > maxBytes) return { ok: false, res: tooLarge(maxBytes) };

  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, res: NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) };
  }
}

/** Cap a single chat message's text (defense in depth — the client also caps this in the composer). */
export const MAX_MESSAGE_CHARS = 1000;
/** Keep recent conversation context bounded so token cost per turn can't balloon. */
const MAX_HISTORY_MESSAGES = 40;
const MAX_HISTORY_CHARS = 24_000; // ~6k tokens of history
// Server-side per-message ceiling. The composer caps USER text at MAX_MESSAGE_CHARS, but a
// tampered client can skip that — and clampChatHistory deliberately always keeps the latest
// message, so without this one ~250KB message passes the byte cap and is forwarded to OpenAI
// whole (~50× the intended per-turn token cost). 6k chars comfortably fits any legitimate
// message we produce (Sage's longest replies + tool-result JSON) while killing the abuse case.
const MAX_SINGLE_MESSAGE_CHARS = 6_000;

/** Truncate a message's string content (and string tool-call args) to the per-message ceiling. */
function clampMessage<T extends { role?: string }>(m: T): T {
  const msg = m as T & { content?: unknown };
  if (typeof msg.content === 'string' && msg.content.length > MAX_SINGLE_MESSAGE_CHARS) {
    return { ...m, content: msg.content.slice(0, MAX_SINGLE_MESSAGE_CHARS) + ' …[truncated]' };
  }
  return m;
}

/**
 * Trim a client-supplied message history to the most recent slice within both a message-count and a
 * total-character budget — the real per-turn cost guard (byte caps alone can be gamed). Keeps order,
 * always keeps at least the latest message, and never starts the kept window on an orphan `tool`
 * message (a tool reply with no preceding assistant tool_calls would make OpenAI 400).
 */
export function clampChatHistory<T extends { role?: string }>(messages: T[]): T[] {
  const kept: T[] = [];
  let chars = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = clampMessage(messages[i]); // per-message ceiling FIRST, so `size` reflects reality
    const size = JSON.stringify(m).length;
    if (kept.length >= MAX_HISTORY_MESSAGES) break;
    if (kept.length > 0 && chars + size > MAX_HISTORY_CHARS) break; // always keep the latest turn
    chars += size;
    kept.unshift(m);
  }
  while (kept.length && kept[0]?.role === 'tool') kept.shift();
  return kept;
}
