export const metadata = {
  title: 'Privacy Policy',
  description: 'How LangToll handles your data: learning data stays on your device, the apps you lock are invisible even to us, AI processing is transient, telemetry is anonymous. No accounts, no tracking.',
  alternates: { canonical: '/privacy' },
};

// LangToll privacy policy — written to match how the product actually works:
// learning data on-device, the blocked-app selection held opaquely by iOS,
// transient AI topic generation, anonymous telemetry, App Attest, no accounts.
const C = { ink: '#f2f2f4', soft: '#a6a6b0', paper: '#0a0a0c', line: 'rgba(255,255,255,0.10)', accent: '#c8ff4d' };

const S = {
  h2: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontSize: 24, margin: '36px 0 12px', color: C.ink } as const,
  p: { lineHeight: 1.65, color: C.soft, margin: '0 0 12px' } as const,
  li: { lineHeight: 1.65, color: C.soft, marginBottom: 8 } as const,
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: C.paper, padding: '64px 24px', fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.accent, fontWeight: 700 }}>LangToll</div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontSize: 40, margin: '4px 0 8px', color: C.ink }}>Privacy Policy</h1>
        <p style={{ ...S.p, fontSize: 14 }}>Last updated: July 17, 2026</p>

        <p style={S.p}>
          LangToll locks the apps that distract you until you practice a language. This policy describes
          exactly what data exists, where it lives, and what (little) ever leaves your phone.
        </p>

        <h2 style={S.h2}>1. Your learning data stays on your device</h2>
        <p style={S.p}>
          Everything LangToll records about you — your name and passenger details, chosen language and
          level, difficulty, practice sessions, per-word progress, streaks, badges, and any AI topic
          packs you generate — is stored in a private database on your device. We do not operate
          accounts, and we keep no server-side copy of your learning history. We could not look at it if
          we wanted to.
        </p>
        <p style={S.p}>
          Because of this, deleting the app (or using “Erase everything” in Settings) permanently
          destroys your data. Standard iOS device backups may include the app’s data and can restore it
          when you move to a new phone.
        </p>

        <h2 style={S.h2}>2. The apps you lock are invisible to us</h2>
        <p style={S.p}>
          LangToll blocks distracting apps using Apple’s Screen Time (Family Controls) framework. When
          you choose which apps to lock, iOS records that choice as a privacy-preserving token that only
          the system can read. LangToll never receives the names or identities of the apps you selected,
          and that choice never leaves your phone. We cannot see what you block, and neither can anyone
          we work with.
        </p>

        <h2 style={S.h2}>3. What leaves your phone, and why</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={S.li}>
            <strong style={{ color: C.ink }}>AI topic packs (Plus).</strong> When you ask LangToll to
            generate a custom vocabulary pack, the topic you type plus your target language and level are
            sent to our server and forwarded to our AI provider (OpenAI) to produce the content. This is
            processed transiently and, per OpenAI’s API terms, is not used to train models. Generated
            packs are cached on our server keyed only by (language, level, topic) so a given topic is
            produced once for everyone — that cache holds learning content alone and reveals nothing
            about any individual.
          </li>
          <li style={S.li}>
            <strong style={{ color: C.ink }}>Anonymous usage signals.</strong> The app reports coarse
            product events (app opened, onboarding completed, a practice session completed, a
            subscription started) tied to a random install identifier. These contain no names, no contact
            details, none of your learning content, and cannot be linked to your identity by us.
          </li>
          <li style={S.li}>
            <strong style={{ color: C.ink }}>App integrity check.</strong> To stop abuse of the paid AI
            endpoint, the app may attach Apple’s App Attest attestation — a cryptographic proof that the
            request comes from a genuine, unmodified copy of LangToll. It contains no personal data and
            does not identify you.
          </li>
        </ul>

        <h2 style={S.h2}>4. What we never collect</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={S.li}>No name, email, phone number, or account of any kind.</li>
          <li style={S.li}>No location data, contacts, photos, or advertising identifiers.</li>
          <li style={S.li}>Not the list of apps you lock — iOS keeps that from us by design.</li>
          <li style={S.li}>No sale or sharing of data with data brokers or advertisers — ever.</li>
        </ul>

        <h2 style={S.h2}>5. Purchases</h2>
        <p style={S.p}>
          Subscriptions are sold through Apple’s In-App Purchase and managed for us by RevenueCat, our
          subscription provider. To know whether LangToll Plus is active, the app sends Apple’s purchase
          receipt and a random, app-generated identifier to RevenueCat — never your name or Apple ID.
          Apple handles all payment details under its own privacy policy; RevenueCat processes the
          receipt under its own.
        </p>

        <h2 style={S.h2}>6. Your support code</h2>
        <p style={S.p}>
          Settings shows a short “support code” derived from your random install identifier. It exists so
          that, <em>if you choose</em> to contact us for help, you can share it and we can look up your
          anonymous device record (plan and purchase status only). It contains none of your learning data,
          and sharing it is entirely optional.
        </p>

        <h2 style={S.h2}>7. Your controls</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={S.li}><strong style={{ color: C.ink }}>Erase:</strong> Settings → “Erase everything”, or simply delete the app.</li>
          <li style={S.li}>Since we hold no personal data about you, there is nothing for us to disclose, correct, or delete on request — the control above is the complete set, in your hands.</li>
        </ul>

        <h2 style={S.h2}>8. Who operates LangToll, and your rights</h2>
        <p style={S.p}>
          LangToll is operated from Germany; the operator of LangToll is the controller for the limited
          processing described above (the transient AI generation and the anonymous usage signals).
          Because we hold no account and no data that identifies you, there is, in practice, no personal
          profile for us to access, correct, port, or erase. Where the GDPR applies you still have the
          rights of access, rectification, erasure, restriction, portability and objection, and the right
          to complain to a supervisory authority; the legal basis for the minimal processing we do is our
          legitimate interest in operating and improving the app (Art. 6(1)(f) GDPR). To exercise a
          right, contact us below.
        </p>

        <h2 style={S.h2}>9. Children</h2>
        <p style={S.p}>
          LangToll is not directed to children, and we do not knowingly collect data from anyone under 16.
        </p>

        <h2 style={S.h2}>10. Changes &amp; contact</h2>
        <p style={S.p}>
          If this policy changes materially, the app will tell you before the change applies to you.
          Questions: privacy@langtoll.app.
        </p>

        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 40, paddingTop: 16, fontSize: 13, color: C.soft }}>
          LangToll is a language-learning app. See our <a href="/terms" style={{ color: C.accent }}>Terms of Use</a>.
        </div>
      </div>
    </main>
  );
}
