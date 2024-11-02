import axios from '@/utils/axios';
import { message } from 'antd'; 
import errorHandler from '@/utils/errorHandler';
import { useRouter as useNextRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * @description Axios call to create or post data to API
 * @param formData
 * @returns
 */
const postFormData = async (url: string, formData: any): Promise<any> => {
  const { data } = await axios.post(url, formData);
  return data;
};

interface UsePostOptions {
  url: string;
  key: string;
  queriesToInvalidate?: string[];
  successMessage?: string;
  redirectUrl?: string;
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: Error) => void;
}

/**
 * @description Custom hook to safely use Next.js router on client side
 */
const useSafeRouter = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useNextRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? router : null;
};

/**
 * @description React-query hook to post data to API
 */
export default (options: UsePostOptions) => {
  const queryClient = useQueryClient();
  const router = useSafeRouter();

  return useMutation({
    mutationFn: (data: any) => postFormData(options.url, data),
    onSuccess: (data: any) => {
      message.success(options.successMessage || 'Data posted successfully');

      options.queriesToInvalidate?.forEach((query: string) => {
        queryClient.invalidateQueries([query] as any);
      });

      if (options.redirectUrl && router) {
        router.push(options.redirectUrl);
      }
      // Call optional onSuccess callback
      if (options.onSuccessCallback) {
        options.onSuccessCallback(data);
      }
    },
    onError: (error: Error) => {
      // Handle the error
      errorHandler(error);

      // Call optional onError callback
      if (options.onErrorCallback) {
        options.onErrorCallback(error);
      }
    },
  });
};
