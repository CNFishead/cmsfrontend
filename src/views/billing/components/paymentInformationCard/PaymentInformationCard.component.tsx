'use client';
import React, { useState, useEffect } from 'react';
import { Button, Descriptions, Empty, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './PaymentInformationCard.module.scss';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { ProcessorActions } from './utils/ProcessorActions.utils';

/**
 * @description - This component displays the user's current billing information, & the user can edit their payment credentials CC & ACH.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Ethan Cannelongo
 * @lastModifiedOn 06/23/2023
 */

const PaymentInformationCard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [processActions, setProcessActions] = useState<any>(null);
  const [customerPaymentInfo, setCustomerPaymentInfo] = useState<any>(null);
  const [isProcessorLoading, setIsProcessorLoading] = useState(false);

  const selectedProfile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const {
    data: billingData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    url: `/payment/${selectedProfile?.payload?._id}`,
    key: ['billing-data', `${selectedProfile?.payload?._id}`],
    enabled: !!selectedProfile?.payload?._id,
    method: 'GET',
  }) as any;

  // Handle processor actions initialization
  useEffect(() => {
    const initializeProcessor = async () => {
      const processor = billingData?.payload?.processor;
      if (!processor || !billingData?.payload?.paymentProcessorData?.[processor]) return;

      setIsProcessorLoading(true);
      try {
        const processorActions = new ProcessorActions(billingData.payload.paymentProcessorData[processor]);
        const actions = await processorActions.getProcessorActions(processor);
        const paymentInfo = actions.getCustomerPaymentMethod();

        setProcessActions(actions);
        setCustomerPaymentInfo(paymentInfo);
      } catch (error) {
        console.error('Error initializing processor:', error);
      } finally {
        setIsProcessorLoading(false);
      }
    };

    if (billingData?.payload) {
      initializeProcessor();
    }
  }, [billingData]);

  if (isLoading || isProcessorLoading) return <Skeleton active />;
  // if (isError) return <Error error={error} />;

  const processor = billingData?.payload?.processor;
  if (!processor) return <Empty description="No payment processor found" />;

  if (!processActions) return <Skeleton active />;

  return (
    <div>
      <div className={styles.buttonContainer}>
        <Button type="dashed" onClick={() => router.push('/billing/edit')} disabled>
          {billingData?.success === false ? 'Add Payment Information' : 'Edit Payment Information'}
        </Button>
      </div>
      <div className={styles.container}>
        <Descriptions title="Billing Information" size="small">
          <Descriptions.Item label="Name">{processActions.getCustomerName()}</Descriptions.Item>
          <Descriptions.Item label="Email">{processActions.getCustomerEmail()}</Descriptions.Item>
          <Descriptions.Item label="Phone #">{processActions.getCustomerPhone()}</Descriptions.Item>
          <Descriptions.Item label="Address">{processActions.getBillingAddress()}</Descriptions.Item>
        </Descriptions>
      </div>

      {customerPaymentInfo.type === 'ACH' && (
        <div className={styles.container}>
          <Descriptions title="Payment Method" size="small">
            <Descriptions.Item label="ACH Account Number">{billingData?.payload?.checkaccount}</Descriptions.Item>
            <Descriptions.Item label="ACH ABA/Routing Number">{billingData?.payload?.checkaba}</Descriptions.Item>
          </Descriptions>
        </div>
      )}
      {customerPaymentInfo.type === 'card' && (
        <div className={styles.container}>
          <Descriptions title="Payment Method" size="small">
            <Descriptions.Item label="Credit Card Number">**** **** **** {customerPaymentInfo?.last4}</Descriptions.Item>
            <Descriptions.Item label="Credit Card Expiration Date">
              {
                // we need to format the expiration date to MM/YYYY
                customerPaymentInfo?.exp_month && customerPaymentInfo?.exp_year ? `${customerPaymentInfo?.exp_month}/${customerPaymentInfo?.exp_year}` : 'N/A'
              }
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  );
};

export default PaymentInformationCard;
