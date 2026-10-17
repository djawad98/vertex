'use client';
import { useState } from 'react';
import { site, serviceGroups } from '../content';

// Static hosting has no server, so the form posts to a form service (e.g. Formspree, Web3Forms).
// Set NEXT_PUBLIC_FORM_ENDPOINT at build time. Without it the form opens the visitor's email app.
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<State>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    if (data.get('company_site')) return; // honeypot: bots fill hidden fields
    data.delete('company_site');
    if (!endpoint) {
      const body = [...data].map(([k, v]) => `${k}: ${v}`).join('\n');
      location.href = `mailto:${site.email}?subject=${encodeURIComponent('New project with Vertex')}&body=${encodeURIComponent(body)}`;
      return;
    }
    setState('sending');
    try {
      const r = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(String(r.status));
      setState('sent');
      f.reset();
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="form-done rv in" role="status">
        <h2>Message sent</h2>
        <p className="muted">Thanks. We will reply within one working day. For anything urgent, call {site.phoneLabel}.</p>
      </div>
    );
  }

  return (
    <form className="form rv" onSubmit={submit} noValidate={false}>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" required autoComplete="name" maxLength={100} />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" required autoComplete="email" maxLength={200} />
        </div>
        <div className="field">
          <label htmlFor="f-phone">Phone <span className="opt">(optional)</span></label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-service">What do you need?</label>
        <select id="f-service" name="service" defaultValue="">
          <option value="" disabled>Choose a service</option>
          {serviceGroups.map((g) => (
            <optgroup key={g.id} label={g.name}>
              {g.items.map((s) => <option key={s.name}>{s.name}</option>)}
            </optgroup>
          ))}
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-msg">About your project</label>
        <textarea id="f-msg" name="message" required rows={6} maxLength={5000} placeholder="Goals, timeline, budget range, links" />
      </div>
      <input className="hp" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn-lg" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {state === 'error' && (
        <p className="form-error" role="alert">
          The message did not send. Check your connection and try again, or email {site.email}.
        </p>
      )}
    </form>
  );
}
