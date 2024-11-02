import React, { useState } from 'react';
import styles from './Billing.module.scss';
// import BillingCard from './layout/card/BillingCard.component';
import Container from '@/layout/container/Container.layout';

// components
import CurrentFeaturesBillingCard from './components/currentFeaturesBillingCard/CurrentFeaturesBillingCard.component';
import PaymentInformationCard from './components/paymentInformationCard/PaymentInformationCard.component';
import PaymentHistoryCard from './components/paymentHistoryCard/PaymentHistoryCard.component';
import { useRouter } from 'next/navigation';

type Props = {};
type BillingCard = {
  title: string;
  component: React.ReactNode;
  // gridKey: string;
};

const BillingView = (props: Props) => {
  return (
    <div className={styles.container}>
      <Container title="Your Payment">
        <CurrentFeaturesBillingCard />
      </Container>
      <Container title="Payment Information">
        <PaymentInformationCard />
      </Container>
      <Container title="Payment History">
        <PaymentHistoryCard />
      </Container>
    </div>
  );
};

export default BillingView;
