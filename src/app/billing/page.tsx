import BillingView from '@/views/billing/Billing.view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Agent Portal | Billing',
  description: 'Billing account center for the Free Agent Portal, the service connecting athletes with teams.',
};

export default function Component() {
  return (
      <BillingView />
  );
}
