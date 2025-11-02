import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { useUser } from '@/state/auth';
import useBilling from './useBilling';

export interface ITransaction {
  _id: string;
  // Basic transaction info
  transactionId: string; // Internal transaction ID
  billingAccountId: string;
  userId: string;
  // Transaction details
  status: 'pending' | 'success' | 'failed' | 'refunded' | 'voided' | 'succeeded' | 'completed';
  type: 'payment' | 'refund' | 'void';
  amount: number;
  currency: string;
  description?: string; // Optional description of what the payment was for
  // Plan information snapshot (optional - not all transactions are plan-related)
  planInfo?: {
    planId: string;
    planName: string;
    planPrice: number;
    billingCycle: 'monthly' | 'yearly';
  };
  // Payment processor info
  processor: {
    name: string;
    transactionId: string;
    response: any; // Raw response from the payment processor
  };
  // Customer info snapshot
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  // Failure tracking
  failure: {
    reason: string;
    code: string;
  };
  // Audit
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionResponse {
  payload: ITransaction[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch resource data from the server
const fetchResource = async (billingId: string) => {
  const { data } = await axios.get(`/payment/receipt`, {
    params: {
      filterOptions: `billingAccountId;${billingId}`,
      limit: 50,
      page: 1,
      sort: 'createdAt:desc',
    },
  });

  return data;
};

export const useTransactions = (
  onSuccess?: (response: TransactionResponse) => void,
  onError?: (error: Error) => void
): UseQueryResult<TransactionResponse, Error> & { transactions: ITransaction[] | null } => {
  const { data: billingInfo } = useBilling() as any;

  const query = useQuery<TransactionResponse, Error>({
    queryKey: ['transactions', billingInfo?._id as any],
    queryFn: () => fetchResource(billingInfo?._id as any),
    enabled: !!billingInfo?._id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      errorMessage: 'An error occurred while fetching transaction data',
    },
  });

  // Get the selected profile (first profile from the array)
  const transactions = query.data?.payload || null;

  // Handle success callback
  if (query.isSuccess && transactions && onSuccess) {
    onSuccess(query.data as TransactionResponse);
  }

  // Handle error callback
  if (query.isError && onError) {
    onError(query.error);
  }

  return {
    ...query,
    transactions,
  };
};
