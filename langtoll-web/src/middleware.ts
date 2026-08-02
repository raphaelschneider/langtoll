// Edge middleware — one image runs as two deployments, so each hides the half it shouldn't serve:
//   - LANDING_ONLY=1 (the langtoll.app app): 404 the app surface (/api/*, /langtoll-adm).
//   - API_ONLY=1     (the api.langtoll.app app): 404 the marketing pages (everything NOT /api or
//     /langtoll-adm), so the landing isn't duplicated on the API host.
// Plus: gate the admin dashboard with HTTP Basic auth (ADMIN_USER / ADMIN_PASSWORD). It lives at
// the non-obvious path /langtoll-adm (not /admin) so bots scanning the well-known path find nothing,
// and is NOT listed in robots.txt. Localhost passes for dev; elsewhere creds are REQUIRED, and if
// unconfigured the route is denied (fail closed).
// Plus: language negotiation for the marketing landing page — see negotiateLocale() below.
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from '@/lib/locales';

// The admin dashboard path — deliberately not /admin (the path bots brute-force) and kept out of
// robots.txt, so it's discoverable only by someone who already knows it. Basic auth is still the
// real gate; the obscure path just cuts the noise/attack surface.
const ADMIN_PATH = '/langtoll-adm';

// Run on everything except Next internals + favicon (so we can gate marketing pages, not just /api).
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };

function unauthorized(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="LangToll admin", charset="UTF-8"' },
  });
}

function notFound(): NextResponse {
  return new NextResponse('Not found', { status: 404 });
}

// --- locale negotiation -----------------------------------------------------------------
// Crawlers must NEVER be redirected off `/`. Google indexes the English root as the canonical
// page and follows the hreflang links itself; bouncing Googlebot to /de because its request
// carried a German Accept-Language would hand the canonical URL's ranking to a translation.
// Deliberately broad: a false positive only costs a bot the (correct) English page.
const CRAWLER_UA =
  /bot|crawler|crawling|spider|slurp|mediapartners|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|whatsapp|telegram|discord|skypeuripreview|vkshare|w3c_validator|lighthouse|headlesschrome|preview|archive\.org|ia_archiver|feedfetcher|duckduck|baidu|yandex|sogou|exabot|applebot|petalbot|semrush|ahrefs|python-requests|curl|wget|axios|node-fetch|go-http-client|java\/|okhttp/i;

/**
 * Best supported locale from an Accept-Language header, honouring q-values.
 *
 * Returns the FIRST supported locale in the visitor's preference order — including 'en'. That
 * matters: a visitor whose list is "en-GB, de" prefers English, so we must stop at 'en' and
 * not fall through to German. Returns null when nothing matches.
 */
function negotiateLocale(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      const weight = q ? Number.parseFloat(q.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(weight) ? weight : 0 };
    })
    .filter((e) => e.tag && e.q > 0)
    // Stable sort by descending q — equal weights keep header order, which is the client's
    // stated preference order.
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === '*') return null; // no real preference expressed
    const base = tag.split('-')[0]; // pt-BR → pt, en-GB → en
    if (isLocale(base)) return base;
  }
  return null;
}

/** Cookie flavour used for both the sticky pick and the "we already negotiated" marker. */
function rememberLocale(res: NextResponse, locale: Locale): NextResponse {
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false, // the client-side switcher writes the same cookie
  });
  return res;
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
  // path + query), so link equity consolidates on langtoll.app instead of duplicating. Falls back
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

  // --- landing language negotiation ---------------------------------------------------
  // Only the marketing surface below this point: /api and /langtoll-adm have already been
  // handled (404'd, redirected, or auth-gated) and returned above.
  if (isAppSurface) return NextResponse.next();

  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;

  // A localized page was requested directly (a switcher click, a shared link, or our own
  // redirect below). Persist the choice so the visitor is never bounced again — this is what
  // makes the pick sticky even with JavaScript disabled.
  const segment = pathname.slice(1);
  if (isLocale(segment) && segment !== DEFAULT_LOCALE) {
    if (cookie === segment) return NextResponse.next();
    return rememberLocale(NextResponse.next(), segment);
  }

  if (pathname !== '/') return NextResponse.next();

  // Whatever we decide for `/`, the decision depends on these two headers. Without Vary a
  // shared cache could hand one visitor's 307-to-/de to everybody who follows.
  const vary = (res: NextResponse) => {
    res.headers.set('Vary', 'Accept-Language, Cookie');
    return res;
  };

  // Explicit choice already on record (including a previous "English is fine") → never
  // second-guess it. Only the ABSENCE of the cookie triggers negotiation, so clicking
  // "English" in the switcher keeps you on `/` for good.
  if (cookie) return vary(NextResponse.next());

  // Crawlers stay on the English root — see CRAWLER_UA.
  const ua = req.headers.get('user-agent') || '';
  if (!ua || CRAWLER_UA.test(ua)) return vary(NextResponse.next());

  const best = negotiateLocale(req.headers.get('accept-language'));
  if (!best || best === DEFAULT_LOCALE) {
    // English preferred (or nothing we serve): stay put, and record it so we don't re-run
    // this negotiation on every subsequent visit.
    return vary(best ? rememberLocale(NextResponse.next(), DEFAULT_LOCALE) : NextResponse.next());
  }

  // 307, not 308: this is a per-visitor negotiation, not a permanent move of `/`. A cached
  // permanent redirect would strand every later visitor — and every crawler — on one language.
  const url = req.nextUrl.clone();
  url.pathname = `/${best}`;
  return vary(rememberLocale(NextResponse.redirect(url, 307), best));
}
