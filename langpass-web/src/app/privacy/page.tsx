export const metadata = {
  title: 'Privacy Policy',
  description: 'How LangPass handles your data: recovery data stays on your device, AI processing is transient, telemetry is anonymous. No accounts, no tracking.',
  alternates: { canonical: '/privacy' },
};

// LangPass privacy policy — written to match how the product actually works:
// recovery data on-device, transient AI processing, anonymous telemetry, no accounts.
const C = { ink: '#14110E', soft: '#6B6258', paper: '#F6F3EE', line: '#E7E1D8', accent: '#C8553D' };

const S = {
  h2: { fontFamily: 'Georgia, serif', fontSize: 24, margin: '36px 0 12px', color: C.ink } as const,
  p: { lineHeight: 1.65, color: C.soft, margin: '0 0 12px' } as const,
  li: { lineHeight: 1.65, color: C.soft, marginBottom: 8 } as const,
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: C.paper, padding: '64px 24px', fontFamily: 'ui-sans-serif, system-ui' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.accent, fontWeight: 700 }}>LangPass</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 40, margin: '4px 0 8px', color: C.ink }}>Privacy Policy</h1>
        <p style={{ ...S.p, fontSize: 14 }}>Last updated: June 14, 2026</p>

        <p style={S.p}>
          LangPass is built so that your recovery is your business. This policy describes exactly what
          data exists, where it lives, and what (little) ever leaves your phone.
        </p>

        <h2 style={S.h2}>1. Your recovery data stays on your device</h2>
        <p style={S.p}>
          Everything you record in LangPass — your injuries, pain levels, daily check-ins, conversations
          with the recovery companion, exercise plans, sessions, milestones, and progress — is stored in
          a private database on your device. We do not operate accounts, and we do not maintain any
          server-side copy of your recovery journal. We could not look at it if we wanted to.
        </p>
        <p style={S.p}>
          Because of this, deleting the app (or using “Erase everything” in Settings) permanently
          destroys your data. Standard iOS device backups may include the app’s data and can restore it
          when you move to a new phone.
        </p>

        <h2 style={S.h2}>2. What leaves your phone, and why</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={S.li}>
            <strong style={{ color: C.ink }}>AI conversations.</strong> When you chat with the recovery
            companion, your message and relevant context (for example your tracked injury, recent pain
            levels, and today’s plan) are sent to our server and forwarded to our AI provider (OpenAI)
            to generate the reply. This data is processed transiently to produce the response: we do
            not store it on our servers, and per OpenAI’s API terms it is not used to train models.
          </li>
          <li style={S.li}>
            <strong style={{ color: C.ink }}>Illustrations.</strong> Generating an exercise or anatomy
            image sends only the exercise name or body-region name — never your personal logs. Generated
            images are cached server-side keyed by that name alone, so they contain and reveal nothing
            about any individual.
          </li>
          <li style={S.li}>
            <strong style={{ color: C.ink }}>Anonymous usage signals.</strong> The app reports coarse
            product events (app opened, onboarding completed, a check-in happened, a subscription
            started) tied to a random install identifier. These contain no names, no contact details,
            and none of the content of your recovery data, and cannot be linked to your identity by us.
          </li>
        </ul>

        <h2 style={S.h2}>3. What we never collect</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={S.li}>No name, email, phone number, or account of any kind.</li>
          <li style={S.li}>No location data, contacts, photos, or advertising identifiers.</li>
          <li style={S.li}>No sale or sharing of data with data brokers or advertisers — ever.</li>
        </ul>

        <h2 style={S.h2}>4. Purchases</h2>
        <p style={S.p}>
          Subscriptions are sold through Apple’s In-App Purchase and managed for us by RevenueCat, our
          subscription provider. To know whether LangPass+ is active, the app sends Apple’s purchase
          receipt and a random, app-generated identifier to RevenueCat — never your name or Apple ID.
          Apple handles all payment details under its own privacy policy; RevenueCat processes the
          receipt under its own.
        </p>

        <h2 style={S.h2}>5. Health data, in plain words</h2>
        <p style={S.p}>
          Information about injuries and pain is sensitive. Our design principle is data minimization:
          we keep it on your device, transmit only what a given AI response strictly requires, store
          none of it server-side, and attach none of it to your identity. LangPass does not read from or
          write to Apple Health unless a future version asks for your explicit permission first.
        </p>

        <h2 style={S.h2}>6. Your controls</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={S.li}><strong style={{ color: C.ink }}>Export:</strong> Settings → “Export my data” produces a complete machine-readable copy.</li>
          <li style={S.li}><strong style={{ color: C.ink }}>Erase:</strong> Settings → “Erase everything”, or simply delete the app.</li>
          <li style={S.li}>Since we hold no personal data about you, there is nothing for us to disclose, correct, or delete on request — the controls above are the complete set, in your hands.</li>
        </ul>

        <h2 style={S.h2}>7. Who operates LangPass, and your rights</h2>
        <p style={S.p}>
          LangPass is operated from Germany; the operator of LangPass is the controller for the limited processing
          described above (the transient AI processing and the anonymous usage signals). Because we hold
          no account and no data that identifies you, there is, in practice, no personal profile for us
          to access, correct, port, or erase. Where the GDPR applies you still have the rights of access,
          rectification, erasure, restriction, portability and objection, and the right to complain to a
          supervisory authority; the legal basis for the minimal processing we do is our legitimate
          interest in operating and improving the app (Art. 6(1)(f) GDPR). To exercise a right, contact
          us below.
        </p>

        <h2 style={S.h2}>8. Children</h2>
        <p style={S.p}>
          LangPass is not directed to children, and we do not knowingly collect data from anyone under 16.
        </p>

        <h2 style={S.h2}>9. Changes & contact</h2>
        <p style={S.p}>
          If this policy changes materially, the app will tell you before the change applies to you.
          Questions: privacy@langpass.app.
        </p>

        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 40, paddingTop: 16, fontSize: 13, color: C.soft }}>
          LangPass is a wellness companion, not a medical device. See our <a href="/terms" style={{ color: C.accent }}>Terms of Use</a>.
        </div>
      </div>
    </main>
  );
}
