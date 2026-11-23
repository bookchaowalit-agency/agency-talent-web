// Keep cross-site links limited: the home page has one portfolio link in its readiness note and a hub link in its
// footer. Service page footers keep only privacy, public status and site feedback links.
export const contactHref = 'mailto:bookchaowalit.work@gmail.com';
export const hubHref = 'https://bookchaowalit.com';
export const portfolioHref = 'https://agency.bookchaowalit.com/agencies';

export default function SiteLinks({ includeHub = false }: { includeHub?: boolean }) {
  return (
    <nav className="site-links" aria-label="ลิงก์เว็บไซต์">
      {includeHub ? <a href={hubHref}>bookchaowalit.com</a> : null}
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      {/* Intake on a showcase site is closed, so the footer mail link is for feedback about the site, and says so. */}
      <a href={contactHref}>Site feedback</a>
    </nav>
  );
}
