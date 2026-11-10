#!/usr/bin/env python3
"""Clean the static client-site copies in public/portfolio/ before they are published.

For every .html page under the given folder:
  - adds <meta name="robots" content="noindex, nofollow"> (and drops any existing robots meta)
  - removes structured data (JSON-LD), which usually repeats phone, email and address
  - removes map embeds (Google Maps, Neshan, Balad)
  - removes phone numbers, email addresses and street addresses from the visible text
  - unlinks tel:, mailto:, sms: and WhatsApp/Telegram contact links

Usage: python3 scripts/sanitize-portfolio.py public/portfolio
Needs: pip install beautifulsoup4
"""
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Comment, NavigableString

D = '[0-9۰-۹٠-٩]'  # Latin, Persian and Arabic digits
SEP = r'[\s\-‌.]?'
PHONE = re.compile(
    '(?<![0-9۰-۹٠-٩])(?:'
    # Mobile: +98 / 0098 / 0 prefix, then 9xx xxx xxxx
    rf'(?:(?:\+|00|۰۰)(?:98|۹۸){SEP})?[0۰]?[9۹]{D}{{2}}{SEP}{D}{{3}}{SEP}{D}{{4}}'
    # Landline with area code: 0xx(x) xxxxxxx(x)
    rf'|[0۰]{D}{{2,3}}{SEP}{D}{{3,4}}{SEP}{D}{{3,4}}'
    # Bare 8-digit city numbers and other long digit runs (prices are written with separators)
    rf'|{D}{{8,12}}'
    ')(?![0-9۰-۹٠-٩])'
)
EMAIL = re.compile(r'[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}')
NOT_EMAIL = re.compile(r'\.(png|jpe?g|gif|webp|svg|avif|css|js)$', re.I)
# Short text that reads like a street address.
ADDRESS_WORDS = ('آدرس', 'نشانی', 'بلوار', 'خیابان', 'کوچه', 'پلاک', 'نبش', 'بزرگراه', 'جاده', 'Address')
CONTACT_HREF = re.compile(r'^(tel:|mailto:|sms:|https?://(wa\.me|api\.whatsapp\.com|t\.me|telegram\.me)/)', re.I)
MAP_SRC = re.compile(r'(google\.[a-z.]+/maps|maps\.google|neshan\.org|balad\.ir|openstreetmap)', re.I)
SKIP_TEXT = {'script', 'style', 'noscript', 'template'}


def scrub_text(s: str) -> str:
    s = PHONE.sub('', s)
    s = EMAIL.sub(lambda m: m.group(0) if NOT_EMAIL.search(m.group(0)) else '', s)
    return s


def looks_like_address(s: str) -> bool:
    t = s.strip()
    return 0 < len(t) <= 250 and any(w in t for w in ADDRESS_WORDS)


def clean(html: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')

    head = soup.head
    if head is None:
        head = soup.new_tag('head')
        (soup.html or soup).insert(0, head)
    for m in soup.find_all('meta', attrs={'name': re.compile(r'^(robots|googlebot|bingbot)$', re.I)}):
        m.decompose()
    head.insert(0, soup.new_tag('meta', attrs={'name': 'robots', 'content': 'noindex, nofollow'}))

    for s in soup.find_all('script', attrs={'type': re.compile('ld\\+json', re.I)}):
        s.decompose()
    for f in soup.find_all('iframe', src=MAP_SRC):
        f.decompose()

    for a in soup.find_all('a', href=CONTACT_HREF):
        a['href'] = '#'
        for attr in ('target', 'rel', 'title', 'aria-label', 'data-phone', 'data-email'):
            a.attrs.pop(attr, None)

    # Attributes that often carry contact details.
    for el in soup.find_all(True):
        for attr in ('title', 'aria-label', 'alt', 'placeholder', 'data-phone', 'data-email', 'data-tel', 'value', 'content'):
            v = el.attrs.get(attr)
            if isinstance(v, str) and v:
                nv = scrub_text(v)
                if attr not in ('alt',) and looks_like_address(nv):
                    nv = ''
                if nv != v:
                    el[attr] = nv

    for node in list(soup.find_all(string=True)):
        if isinstance(node, Comment):
            node.extract()
            continue
        parent = node.parent.name if node.parent else ''
        if parent in SKIP_TEXT:
            if parent == 'script' and node.strip():
                new = scrub_text(str(node))
                if new != str(node):
                    node.replace_with(NavigableString(new))
            continue
        text = str(node)
        new = '' if looks_like_address(text) else scrub_text(text)
        if new != text:
            node.replace_with(NavigableString(new))

    return str(soup)


def main(root: str) -> None:
    pages = sorted(Path(root).rglob('*.html'))
    changed = 0
    for p in pages:
        raw = p.read_text(encoding='utf-8', errors='replace')
        out = clean(raw)
        if out != raw:
            p.write_text(out, encoding='utf-8')
            changed += 1
    print(f'sanitized {changed} of {len(pages)} pages under {root}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'public/portfolio')
