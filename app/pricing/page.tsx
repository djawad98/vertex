import type { Metadata } from 'next';
import { ShapeDefs } from '../hero';
import { PageHead, Halo, Cta } from '../ui';
import Calculator from './calculator';

export const metadata: Metadata = {
  title: 'Pricing calculator',
  description: 'Estimate the base price of Vertex services in Toman: app and e-commerce development, SEO, logo and graphic design, and social media. Live USDT rate from Nobitex.',
};

export default function Pricing() {
  return (
    <>
      <ShapeDefs />
      <PageHead title="Pricing" lead="Pick the services you need and see a base price in Toman, updated with the live USDT rate." />
      <section className="section has-halo" aria-label="Pricing calculator">
        <Halo img="network" />
        <Calculator />
      </section>
      <Cta />
    </>
  );
}
