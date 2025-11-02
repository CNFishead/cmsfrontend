import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useUser } from '@/state/auth';
import axios from '@/utils/axios';
import User from '@/types/User'; 
import { IPlan } from '@/types/IPlan';

// Define the billing information interface
export interface IBilling {
  _id: string;
  customerId: string;
  profileId: string;
  email: string;
  profileType: string;
  features: string[];
  status: string;
  trialLength: number;
  processor?: string;
  credits?: number;
  setupFeePaid?: boolean;
  createdAt: Date;
  updatedAt: Date;
  vaulted: boolean;
  vaultId: string;
  nextBillingDate?: Date;
  needsUpdate?: boolean;
  payor: User;
  plan: IPlan;
  // is yearly? whether or not the subscription is yearly
  isYearly?: boolean;
  // Payment processor specific data map
  paymentProcessorData?: {
    [processorName: string]: any;
  };
}

// Fetch function for billing data
const fetchBillingData = async (userId: string): Promise<IBilling> => {
  const { data } = await axios.get(`/auth/billing`, {
    params: {
      filterOptions: `payor;${userId}`,
    }
  });
  return data.payload[0];
};

/**
 * Custom hook to fetch the logged-in user's billing details
 * Uses React Query for caching and state management
 *
 * @param options Optional configuration for the query
 * @returns UseQueryResult containing billing information
 */
export const useBilling = (options?: {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchInterval?: number;
  retry?: number | boolean;
}) => {
  const { data: loggedInUser } = useUser();

  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 1000 * 60 * 5, // 5 minutes
    gcTime = 1000 * 60 * 10, // 10 minutes
    refetchInterval,
    retry = 1,
  } = options || {};

  return useQuery({
    queryKey: ['billing', loggedInUser?._id],
    queryFn: () => fetchBillingData(loggedInUser!._id),
    enabled: enabled && !!loggedInUser?._id,
    refetchOnWindowFocus,
    staleTime,
    gcTime,
    refetchInterval,
    retry,
  }) as UseQueryResult<IBilling, Error>;
};

/**
 * Hook to get billing info with additional helper properties
 * Provides computed properties for easier component usage
 */
export const useBillingInfo = (options?: Parameters<typeof useBilling>[0]) => {
  const billingQuery = useBilling(options);
  const billingData = billingQuery.data;

  return {
    ...billingQuery,
    billingInfo: billingData,
    // Helper computed properties based on actual BillingInfo interface
    hasActiveSubscription: billingData?.status === 'active',
    isActiveStatus: billingData?.status === 'active',
    hasVaultedPayment: billingData?.vaulted ?? false,
    needsUpdate: billingData?.needsUpdate ?? false,
    setupFeePaid: billingData?.setupFeePaid ?? false,
    hasCredits: (billingData?.credits ?? 0) > 0,
    isYearlySubscription: billingData?.isYearly ?? false,
    hasNextBillingDate: !!billingData?.nextBillingDate,
    trialActive: billingData?.trialLength ? billingData.trialLength > 0 : false,
  };
};

export default useBilling;
