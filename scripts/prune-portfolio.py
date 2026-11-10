#!/usr/bin/env python3
"""Trim each static client-site copy in public/portfolio/<id>/ to a few pages.

For every site folder:
  - keeps index.html plus the pages it links to first (breadth-first), up to MAX pages
  - points links to removed pages (and to the original live site) at the copy's home page
  - deletes files (images, CSS, JS, fonts, ...) that no kept page refers to, directly or through CSS/JS

Usage: python3 scripts/prune-portfolio.py public/portfolio [MAX=10]
Needs: pip install beautifulsoup4
"""
import os
import posixpath
import re
import sys
from collections import deque
from pathlib import Path
from urllib.parse import unquote, urlsplit

from bs4 import BeautifulSoup

# Text files whose contents can refer to further files.
KEEP_ALWAYS = {'.css', '.js', '.mjs', '.json', '.svg', '.txt', '.xml', '.webmanifest'}
# Split page/CSS/JS text into path segments, so a file is "used" when its name appears as one.
TOKEN_SPLIT = re.compile(r'[\s"\'()<>,/\\?#`]+')


def local_target(page: Path, href: str, root: Path):
    """Resolve a relative link on `page` to a file under `root`, or None if it isn't one."""
    if not href or href.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:', '//')):
        return None
    parts = urlsplit(href)
    if parts.scheme or parts.netloc:
        return None
    path = unquote(parts.path)
    if not path:
        return None
    target = Path(posixpath.normpath(posixpath.join(page.parent.as_posix(), path)))
    if path.endswith('/') or target.is_dir():
        target = target / 'index.html'
    try:
        target.relative_to(root)
    except ValueError:
        return None
    return target


URL_ATTRS = ('src', 'data-src', 'data-lazy-src', 'data-bg', 'data-background', 'poster',
             'srcset', 'data-srcset', 'data-lazy-srcset')


def localize(value: str, page: Path, root: Path, hosts: set, srcset: bool = False) -> str:
    """Rewrite absolute URLs on the live site's host to relative paths when the file exists locally."""
    def one(url: str) -> str:
        parts = urlsplit(url if not url.startswith('//') else 'https:' + url)
        if (parts.hostname or '').removeprefix('www.') not in hosts:
            return url
        local = root / unquote(parts.path).lstrip('/')
        if local.is_dir():
            local = local / 'index.html'
        if not local.is_file():
            return url
        return os.path.relpath(local, page.parent).replace(os.sep, '/')

    if not srcset:
        return one(value.strip())
    out = []
    for part in value.split(','):
        bits = part.strip().split()
        if bits:
            bits[0] = one(bits[0])
            out.append(' '.join(bits))
    return ', '.join(out)


def pick_size(srcset: str, target: int = 1024) -> str:
    """Reduce a srcset to its single largest candidate no wider than `target` (or its smallest)."""
    cands = []
    for part in srcset.split(','):
        bits = part.strip().split()
        if not bits:
            continue
        w = 0
        if len(bits) > 1 and bits[1].endswith('w') and bits[1][:-1].isdigit():
            w = int(bits[1][:-1])
        cands.append((w, bits[0]))
    if not cands:
        return srcset
    fit = [c for c in cands if 0 < c[0] <= target]
    w, url = max(fit) if fit else min(cands)
    return f'{url} {w}w' if w else url


def drop_legacy_fonts(root: Path) -> None:
    """Delete .eot fonts, and .ttf/.otf/.svg fonts that have a .woff2/.woff twin in the same folder."""
    for f in list(root.rglob('*')):
        if not f.is_file():
            continue
        ext = f.suffix.lower()
        if 'font' not in f.as_posix().lower() and ext not in ('.eot', '.ttf', '.otf'):
            continue
        if ext == '.eot':
            f.unlink()
        elif ext in ('.ttf', '.otf', '.svg'):
            if any((f.with_suffix(s)).exists() for s in ('.woff2', '.woff')):
                f.unlink()


def site_hosts(index: Path) -> set:
    """Hosts of the original live site, from the canonical / og:url / shortlink tags."""
    soup = BeautifulSoup(index.read_text(encoding='utf-8', errors='replace'), 'html.parser')
    hosts = set()
    for tag in soup.find_all('link', rel=True, href=True):
        if any(r in ('canonical', 'shortlink') for r in tag['rel']):
            hosts.add(urlsplit(tag['href']).hostname)
    for tag in soup.find_all('meta', property='og:url', content=True):
        hosts.add(urlsplit(tag['content']).hostname)
    hosts.discard(None)
    return {h.removeprefix('www.') for h in hosts}


def prune_site(root: Path, max_pages: int) -> str:
    index = root / 'index.html'
    if not index.exists():
        return f'{root.name}: no index.html, skipped'
    all_pages = sorted(root.rglob('*.html'))
    hosts = site_hosts(index)

    # Breadth-first from the home page, in link order.
    keep, queue, seen = [], deque([index]), {index}
    while queue and len(keep) < max_pages:
        page = queue.popleft()
        keep.append(page)
        soup = BeautifulSoup(page.read_text(encoding='utf-8', errors='replace'), 'html.parser')
        for a in soup.find_all('a', href=True):
            t = local_target(page, a['href'], root)
            if t and t.suffix == '.html' and t.exists() and t not in seen:
                seen.add(t)
                queue.append(t)
    kept = set(keep)

    # Re-point links to removed pages and to the live site at the copy's home page,
    # and keep one size per responsive image so the other sizes can be deleted.
    for page in keep:
        raw = page.read_text(encoding='utf-8', errors='replace')
        soup = BeautifulSoup(raw, 'html.parser')
        home = os.path.relpath(index, page.parent).replace(os.sep, '/')
        changed = False
        # Lazy-load attributes often still point at the live site; use the local copy when there is one.
        for el in soup.find_all(True):
            for attr in URL_ATTRS:
                v = el.get(attr)
                if isinstance(v, str) and '//' in v:
                    nv = localize(v, page, root, hosts, srcset='srcset' in attr)
                    if nv != v:
                        el[attr] = nv
                        changed = True
        for el in soup.find_all(['img', 'source']):
            for attr in ('srcset', 'data-srcset', 'data-lazy-srcset'):
                if el.get(attr):
                    one = pick_size(el[attr])
                    if one and one != el[attr]:
                        el[attr] = one
                        changed = True
            if el.get('sizes'):
                del el['sizes']
        for a in soup.find_all('a', href=True):
            href = a['href']
            host = (urlsplit(href).hostname or '').removeprefix('www.')
            if host and host in hosts:
                a['href'] = home
                changed = True
                continue
            t = local_target(page, href, root)
            if t and t.suffix == '.html' and t not in kept:
                a['href'] = home
                changed = True
        if changed:
            page.write_text(str(soup), encoding='utf-8')

    removed_pages = 0
    for page in all_pages:
        if page not in kept:
            page.unlink()
            removed_pages += 1

    # Files that nothing kept refers to, matched by file name (so it errs on the side of keeping).
    # Start from the kept pages, then follow references through CSS/JS until nothing new turns up.
    others = [f for f in root.rglob('*') if f.is_file() and f.suffix != '.html']
    names = set()

    def add_refs(t: str) -> None:
        for chunk in (t, unquote(t)):
            names.update(TOKEN_SPLIT.split(chunk))

    for p in keep:
        add_refs(p.read_text(encoding='utf-8', errors='replace'))
    used = set()
    while True:
        new = [f for f in others if f not in used and f.name in names]
        if not new:
            break
        used.update(new)
        for f in new:
            if f.suffix.lower() in KEEP_ALWAYS or '.css' in f.name or '.js' in f.name:
                add_refs(f.read_text(encoding='utf-8', errors='replace'))
    removed_files, freed = 0, 0
    for f in others:
        if f not in used:
            freed += f.stat().st_size
            f.unlink()
            removed_files += 1

    drop_legacy_fonts(root)

    for d in sorted((p for p in root.rglob('*') if p.is_dir()), key=lambda p: len(p.parts), reverse=True):
        if not any(d.iterdir()):
            d.rmdir()

    return (f'{root.name}: kept {len(keep)} of {len(all_pages)} pages, removed {removed_pages} pages '
            f'and {removed_files} unused files ({freed / 1e6:.1f} MB)')


def main(base: str, max_pages: int) -> None:
    for site in sorted(p for p in Path(base).iterdir() if p.is_dir()):
        print(prune_site(site, max_pages))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'public/portfolio', int(sys.argv[2]) if len(sys.argv) > 2 else 10)
