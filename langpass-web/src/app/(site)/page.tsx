// English landing page. Stays at `/` (not `/en`) so the canonical URL that is already
// indexed and linked never moves — the other five locales live at `/<locale>`.
// All copy and metadata come from src/lib/landing-copy.ts; the markup lives in <Landing>.
import { Landing } from '@/components/landing/Landing';

// Statically cached, re-rendered in the background at most once an hour — so the MySQL price
// read happens ~once/hour regardless of traffic, never per visitor. The admin "Save" calls
// revalidatePath('/'), so price edits show up immediately rather than waiting for the window.
export const revalidate = 3600;

export default function Home() {
  return <Landing locale="en" />;
}
