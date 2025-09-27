import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from '@/styles/Form.module.scss';
import { states } from '@/data/states';
import { countries } from '@/data/countries';
import { usePaymentStore } from '@/state/payment';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useInterfaceStore } from '@/state/interface';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const USE_STRIPE = true; // Replace with your own logic or config

const StripeCardFields: React.FC<{ onTokenCreated: (token: string) => void }> = ({ onTokenCreated }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const createToken = async () => {
    if (!stripe || !elements) {
      setError('Stripe is not loaded');
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }
    const { error, token } = await stripe.createToken(cardElement);
    if (error) {
      setError(error.message || 'Payment error');
      return;
    }
    if (token) {
      setError(null);
      onTokenCreated(token.id);
    }
  };

  // Auto-tokenize when card is complete
  const handleCardChange = (event: any) => {
    if (event.complete) {
      createToken();
    }
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        <CardElement options={{ hidePostalCode: true }} onChange={handleCardChange} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12, fontSize: '14px' }}>{error}</div>}
    </div>
  );
};

const CardForm = () => {
  const [form] = Form.useForm();
  const [country, setCountry] = useState(countries[0]);
  const { paymentFormValues, setCurrentForm, setPaymentFormValues } = usePaymentStore((state) => state);
  const [stripeToken, setStripeToken] = useState<string | null>(null);
  const { addAlert } = useInterfaceStore();
  const onFinish = async (values: any) => {
    const isValid = await form.validateFields();
    if (!isValid) {
      message.error('Please fill out all required fields');
      return;
    }

    // if using Stripe, ensure token is created
    if (USE_STRIPE && !stripeToken) {
      addAlert({ message: 'Please complete your card information', type: 'error' });
      return;
    }
    // Include Stripe token if using Stripe
    const finalValues = {
      ...values,
      ...(USE_STRIPE && stripeToken ? { stripeToken } : {}),
    };

    setPaymentFormValues(finalValues);
  };

  const handleTokenCreated = (token: string) => {
    setStripeToken(token);
    // Optionally show success message
    message.success('Card information secured');
  };

  useEffect(() => {
    form.setFieldsValue(paymentFormValues);
    setCurrentForm(form);
  }, []);

  // ...existing code...
  return (
    <div>
      <Form form={form} className={styles.form} layout="vertical" onFinish={onFinish}>
        <div className={styles.row}>
          {/* Card fields: Stripe or custom */}
          {USE_STRIPE ? (
            <div className={styles.field} style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Card Information</label>
              <Elements stripe={stripePromise}>
                <StripeCardFields onTokenCreated={handleTokenCreated} />
              </Elements>
            </div>
          ) : (
            <>
              <Form.Item name="ccnumber" label="Card Number" rules={[{ required: true, message: 'Please input your card number' }]} className={styles.field}>
                <Input placeholder={'Customer card number'} className={styles.input} />
              </Form.Item>
              <Form.Item name="ccexp" label="Expiration Date" rules={[{ required: true, message: 'Please input card expiration date' }]} className={styles.field}>
                <Input placeholder={'MM/YY'} className={styles.input} />
              </Form.Item>
              <Form.Item
                name="cvv"
                label="Card CVV #"
                rules={[
                  {
                    required: true,
                    message: 'Please input the CVV card number!',
                  },
                ]}
                tooltip="The CVV # is the 3 digits number on the back of your card."
                className={styles.field}
              >
                <Input placeholder={'CVV'} className={styles.input} />
              </Form.Item>
            </>
          )}
        </div>
        {/* ...existing code for other fields... */}
        <div className={styles.row}>
          <Form.Item
            name="first_name"
            label="First Name on Card"
            rules={[
              {
                required: true,
                message: 'Please input the first Name on the card ',
              },
            ]}
            className={styles.field}
          >
            <Input placeholder={'First Name'} className={styles.input} />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name on Card"
            rules={[
              {
                required: true,
                message: 'Please input the Last Name on the card ',
              },
            ]}
            className={styles.field}
          >
            <Input placeholder={'Last Name'} className={styles.input} />
          </Form.Item>
        </div>

        <div className={styles.row}>
          <Form.Item name="address1" label="Address" rules={[{ required: true, message: 'Please input address' }]} className={styles.field}>
            <Input placeholder={'Address'} className={styles.input} />
          </Form.Item>
          <Form.Item name="address2" label="Address 2" className={styles.field}>
            <Input placeholder={'Address 2'} className={styles.input} />
          </Form.Item>
        </div>
        <div className={styles.row}>
          <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please input country!' }]} initialValue={countries[0]} className={styles.field}>
            <select className={styles.input}>
              {countries.map((country) => (
                <option onSelect={() => setCountry(country)} key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </Form.Item>
          {country === 'United States' && (
            <Form.Item name="state" label="State" rules={[{ required: true, message: 'Please input state!' }]} initialValue={states[0].abbreviation} className={styles.field}>
              <select className={styles.input}>
                {states.map((state) => (
                  <option key={state.abbreviation} value={state.abbreviation}>
                    {state.abbreviation}
                  </option>
                ))}
              </select>
            </Form.Item>
          )}
        </div>
        <div className={styles.row}>
          <Form.Item name="zip" label="Zip Code" rules={[{ required: true, message: 'Please input your zip code' }]} className={styles.field}>
            <Input placeholder={'Customer Zip Code'} className={styles.input} />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please input your city' }]} className={styles.field}>
            <Input placeholder={'Customer City'} className={styles.input} />
          </Form.Item>
        </div>

        {/* save button for custom form only */}
        <Button type="primary" onClick={() => onFinish(form.getFieldsValue())} className={styles.submitButton}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default CardForm;
