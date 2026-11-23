import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';
import ServicePage from '@/app/services/[slug]/page';
import { LangText } from '@/components/lang-text';
import { pseoService } from '@/lib/pseo';
import type { AgencyStatus } from '@/lib/readiness';
import { site } from '@/lib/site';
import { hubHref } from '@/components/site-links';
import { socialImage } from '@/lib/site-config';

// 2026-11-18 review: Thai nav, a reachable hub from the home page, and no repeated hub links on service pages.
describe('UX floor', () => {
  it('links the home page to the hub and keeps cross-site links out of service footers', async () => {
    const home = renderToString(<Home />);
    const service = renderToString(await ServicePage({ params: Promise.resolve({ slug: pseoService.slug }) }));
    const homeFooter = home.slice(home.lastIndexOf('<footer'));
    const serviceFooter = service.slice(service.lastIndexOf('<footer'));
    expect(homeFooter).toContain(`href="${hubHref}">bookchaowalit.com</a>`);
    expect(homeFooter).toContain('href="https://bookchaowalit.com/privacy"');
    expect(homeFooter).toContain('href="https://monitor.bookchaowalit.com/"');
    expect(homeFooter).toContain('href="mailto:bookchaowalit.work@gmail.com"');
    expect(serviceFooter).not.toContain(`href="${hubHref}"`);
    expect(serviceFooter).not.toMatch(/href="https:\/\/agency\.bookchaowalit\.com/);
    expect(serviceFooter).toContain('href="https://bookchaowalit.com/privacy"');
    expect(serviceFooter).toContain('href="https://monitor.bookchaowalit.com/"');
    expect(serviceFooter).toContain('href="mailto:bookchaowalit.work@gmail.com"');
    expect(home.match(/href="https:\/\/agency\.bookchaowalit\.com[^"]*"/g)).toHaveLength(1);
    expect(home.match(new RegExp(`href="${hubHref}"`, 'g'))).toHaveLength(2);
    expect(service).not.toMatch(/href="https:\/\/agency\.bookchaowalit\.com/);
    expect(service).not.toContain(`href="${hubHref}"`);
  });

  it('uses Thai nav labels that match the section headings', () => {
    const html = renderToString(<Home />);
    for (const label of ['ขอบเขต', 'ความพร้อม', 'บริการ']) expect(html).toContain(`>${label}</`);
    expect(html).not.toMatch(/>Scope</);
  });

  it('gives each readiness state a next step without inviting an inquiry before the gate opens', () => {
    const html = renderToString(<Home />);
    expect(html).toContain('ดูทั้ง 14 กลุ่มงาน');
    // The readiness note links to the hub without collecting inquiries; the only mailto is labelled site feedback.
    expect(html.match(/href="mailto:/g)).toHaveLength(1);
    expect(html).toContain(`href="${hubHref}">ติดต่อหรือนัดคุยผ่าน bookchaowalit.com`);
    expect(html).toContain('href="mailto:bookchaowalit.work@gmail.com">Site feedback</a>');
    expect(html).not.toContain('>Contact</a>');
    if ((site.status as AgencyStatus) === 'locked') expect(html).toContain('ยังไม่เปิดรับงาน');
    else expect(html).not.toContain('ยังไม่เปิดรับงาน');
  });

  it('shares the Open Graph image on service pages too', async () => {
    const { generateMetadata } = await import('@/app/services/[slug]/page');
    const meta = await generateMetadata({ params: Promise.resolve({ slug: pseoService.slug }) });
    // Whatever base URL this build uses (NEXT_PUBLIC_SITE_URL or the production fallback), the service page shares it.
    expect(JSON.stringify(meta.openGraph)).toContain(JSON.stringify(socialImage.url));
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('marks English runs in Thai copy with lang="en"', () => {
    expect(renderToString(<LangText text="ลดความเสี่ยงของ cyber-physical systems ด้วยหลักฐาน" />)).toContain('<span lang="en">cyber-physical systems</span>');
    expect(renderToString(<LangText text="ภาษาไทยล้วน" />)).toBe('ภาษาไทยล้วน');
  });

  it('draws the focus ring at 3:1 or more on the page background', () => {
    // Light :root tokens in cascade order: design-floor defaults, the site theme (if any), then globals.css.
    const tokens = new Map<string, string>();
    for (const file of ['design-floor/tokens.css', 'app-theme.css', 'globals.css']) {
      const path = join(process.cwd(), 'app', file);
      if (!existsSync(path)) continue;
      const root = readFileSync(path, 'utf8').match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';
      for (const [, name, value] of root.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) tokens.set(name, value.trim());
    }
    const resolve = (name: string, depth = 0): string | undefined => {
      const value = tokens.get(name);
      const ref = value?.match(/^var\(--([a-z0-9-]+)\)$/);
      return ref && depth < 8 ? resolve(ref[1], depth + 1) : value;
    };
    const focusRule = readFileSync(join(process.cwd(), 'app', 'ux-floor.css'), 'utf8').match(/:focus-visible, a:focus-visible, :where\(button, input, select, summary\):focus-visible \{([^}]*)\}/)?.[1] ?? '';
    expect(focusRule).toContain('outline-offset: 5px');
    const fallback = focusRule.match(/var\(--focus, var\(--([a-z-]+)\)\)/)![1];
    const ring = resolve('focus') ?? resolve(fallback)!;
    const bg = resolve('bg')!;
    expect(ring).toMatch(/^#[0-9a-f]{6}$/i);
    expect(bg).toMatch(/^#[0-9a-f]{6}$/i);
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [luminance(ring), luminance(bg)].sort((x, y) => y - x);
    expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(3);
  });
});
