// Edge middleware — one image runs as two deployments, so each hides the half it shouldn't serve:
//   - LANDING_ONLY=1 (the langpass.app app): 404 the app surface (/api/*, /langpass-adm).
//   - API_ONLY=1     (the api.langpass.app app): 404 the marketing pages (everything NOT /api or
//     /langpass-adm), so the landing isn't duplicated on the API host.
// Plus: gate the admin dashboard with HTTP Basic auth (ADMIN_USER / ADMIN_PASSWORD). It lives at
// the non-obvious path /langpass-adm (not /admin) so bots scanning the well-known path find nothing,
// and is NOT listed in robots.txt. Localhost passes for dev; elsewhere creds are REQUIRED, and if
// unconfigured the route is denied (fail closed).
import { NextRequest, NextResponse } from 'next/server';

// The admin dashboard path — deliberately not /admin (the path bots brute-force) and kept out of
// robots.txt, so it's discoverable only by someone who already knows it. Basic auth is still the
// real gate; the obscure path just cuts the noise/attack surface.
const ADMIN_PATH = '/langpass-adm';

// Run on everything except Next internals + favicon (so we can gate marketing pages, not just /api).
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };

function unauthorized(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="LangPass admin", charset="UTF-8"' },
  });
}

function notFound(): NextResponse {
  return new NextResponse('Not found', { status: 404 });
}

// Length-aware constant-time compare so the credential check can't be timed character-by-character.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const isAppSurface = pathname.startsWith('/api') || pathname.startsWith(ADMIN_PATH);

  // Landing deployment: hide the app surface (404 — these routes shouldn't exist here).
  if (process.env.LANDING_ONLY === '1' && isAppSurface) return notFound();
  // API deployment: a marketing path on the API host → 301 to the canonical landing (preserving the
  // path + query), so link equity consolidates on langpass.app instead of duplicating. Falls back
  // to 404 if LANDING_URL isn't configured.
  if (process.env.API_ONLY === '1' && !isAppSurface) {
    const base = process.env.LANDING_URL;
    if (base) return NextResponse.redirect(new URL(pathname + req.nextUrl.search, base), 301);
    return notFound();
  }

  // Admin Basic-auth gate (only reached on the API deployment).
  if (pathname.startsWith(ADMIN_PATH)) {
    // Dev-only bypass. Deliberately NOT hostname-based: behind a reverse proxy the hostname the
    // middleware sees is proxy/header-controlled and read as localhost in production, which left
    // the dashboard wide open.
    if (process.env.NODE_ENV === 'development') return NextResponse.next();

    const user = process.env.ADMIN_USER || '';
    const pass = process.env.ADMIN_PASSWORD || '';
    if (!user || !pass) return unauthorized(); // fail closed when unconfigured

    const header = req.headers.get('authorization') || '';
    const [scheme, encoded] = header.split(' ');
    if (scheme === 'Basic' && encoded) {
      // atob is available in the edge runtime; Buffer is not. Split on the FIRST colon only —
      // RFC 7617 allows colons in the password.
      const decoded = atob(encoded);
      const sep = decoded.indexOf(':');
      const u = sep < 0 ? decoded : decoded.slice(0, sep);
      const p = sep < 0 ? '' : decoded.slice(sep + 1);
      if (safeEqual(u, user) && safeEqual(p, pass)) return NextResponse.next();
    }
    return unauthorized();
  }

  return NextResponse.next();
}
