export interface StripeProcessorData {
  customer?: {
    id: string;
    object: string;
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    balance?: number;
    created?: number;
    currency?: string;
    deliquent?: boolean;
    description?: string;
    discount?: any;
    email?: string;
    invoice_prefix?: string;
    name?: string;
    phone?: string;
    preferred_locales?: string[];
    shipping?: any;
    tax_exempt?: string;
  };
  paymentMethod?: {
    id: string;
    object: string;
    billing_details?: {
      address?: {
        city?: string;
        country?: string;
        line1?: string;
        line2?: string;
        postal_code?: string;
        state?: string;
      };
      email?: string;
      name?: string;
      phone?: string;
    };
    card?: {
      brand?: string;
      checks?: {
        address_line1_check?: string;
      };
      country?: string;
      display_brand?: string;
      exp_month?: number;
      exp_year?: number;
      fingerprint?: string;
      funding?: string;
      generated_from?: any;
      last4?: string;
    };
    type?: string;
  };
}

export class StripeActionsHandler {
  private processorData: StripeProcessorData;
  constructor(processorData: StripeProcessorData) {
    this.processorData = processorData;
  }

  public getBillingAddress() {
    return this.formatAddress(this.processorData?.customer?.address || this.processorData?.paymentMethod?.billing_details?.address || {});
  }

  formatAddress(address: { [key: string]: any }) {
    const { line1 = '', line2 = '', city = '', state = '', country = '', postal_code = '' } = address;
    const parts = [line1, line2, city, state, country, postal_code].filter((part) => part && part.trim() !== '');
    return parts.join(', ');
  }

  public getCustomerPaymentMethod() {
    return {
      last4: this.processorData?.paymentMethod?.card?.last4,
      exp_month: this.processorData?.paymentMethod?.card?.exp_month,
      exp_year: this.processorData?.paymentMethod?.card?.exp_year,
      brand: this.processorData?.paymentMethod?.card?.brand,
      type: this.processorData?.paymentMethod?.type,
    };
  }

  public getCustomerName() {
    return this.processorData?.customer?.name || this.processorData?.paymentMethod?.billing_details?.name || 'N/A';
  }

  public getCustomerEmail() {
    return this.processorData?.customer?.email || this.processorData?.paymentMethod?.billing_details?.email || 'N/A';
  }

  public getCustomerPhone() {
    return this.formatPhoneNumber(this.processorData?.customer?.phone || this.processorData?.paymentMethod?.billing_details?.phone || 'N/A');
  }

  formatPhoneNumber(phoneNumber: string) {
    const cleaned = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match and capture groups for area code, prefix, and line number

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`; // Format as XXX-XXX-XXXX
    }

    // Return the original string if it doesn't match the expected format
    return phoneNumber;
  }
}
