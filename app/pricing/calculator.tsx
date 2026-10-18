'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { serviceGroups } from '../content';
import { ServiceIcon } from '../icons';

// Live USDT price from Nobitex (public, CORS-enabled). Price comes in rials; 10 rials = 1 toman.
const API = 'https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt&dstCurrency=rls';
const toman = (n: number) => `${Math.round(n).toLocaleString('en-US')} Toman`;
// Each service price rounds up to the next 1,000 Toman; the total is the sum of the rounded prices, so they add up.
const STEP = 1000;
const price = (usd: number, rate: number) => Math.ceil(usd * rate / STEP) * STEP;

export default function Calculator() {
  const [rate, setRate] = useState<number | null>(null); // toman per USDT
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = () => fetch(API)
      .then((r) => r.json())
      .then((d) => {
        const rls = Number(d?.stats?.['usdt-rls']?.latest);
        if (!(rls > 0)) throw new Error('bad rate');
        setRate(rls / 10);
        setFailed(false);
      })
      .catch(() => setFailed(true));
    load();
    const t = setInterval(() => { if (!document.hidden) load(); }, 3_600_000);
    return () => clearInterval(t);
  }, []);

  const items = serviceGroups.flatMap((g) => g.items);
  const total = rate ? items.filter((s) => picked.has(s.name)).reduce((sum, s) => sum + price(s.usd ?? 0, rate), 0) : 0;
  const toggle = (name: string) => setPicked((p) => {
    const n = new Set(p);
    if (!n.delete(name)) n.add(name);
    return n;
  });

  return (
    <>
      <ul className="groups calc">
        {serviceGroups.map((g) => {
          const priced = g.items.every((s) => s.usd != null);
          return (
            <li key={g.id} className="group">
              <ServiceIcon id={g.id} />
              <h3 id={`calc-${g.id}`}>{g.name}</h3>
              <p className="muted">{g.intro}</p>
              {priced ? (
                <ul className="picks" aria-labelledby={`calc-${g.id}`}>
                  {g.items.map((s) => (
                    <li key={s.name}>
                      <label className="pick">
                        <input type="checkbox" checked={picked.has(s.name)} onChange={() => toggle(s.name)} />
                        <span>{s.name}</span>
                        <span className="price">{rate ? `from ${toman(price(s.usd!, rate))}` : '…'}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <ul className="tags">{g.items.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
                  <p className="muted">Every AI project is scoped to your data and workflow, so we price it after a short call.</p>
                  <Link className="btn btn-ghost" href="/contact/">Let’s talk</Link>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <div className="quote" aria-live="polite">
        <div>
          <p className="muted">{picked.size} {picked.size === 1 ? 'service' : 'services'} selected</p>
          <output className="total">
            {failed && !rate ? 'Price unavailable' : rate ? toman(total) : 'Loading price…'}
          </output>
        </div>
        <Link className="btn" href="/contact/">Get a quote</Link>
      </div>
      <p className="muted note">
        These are base prices. The final price may vary with your preferences, scope and timeline.
        {' '}Prices follow the live USDT rate on Nobitex{rate ? ` (1 USDT = ${toman(rate)})` : ''}.
        {failed && !rate && ' The rate could not be loaded right now; try again in a moment.'}
      </p>
    </>
  );
}
