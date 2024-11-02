import axios from "@/utils/axios";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import errorHandler from "@/utils/errorHandler";
import { useRouter } from "next/navigation";

/**
 * @description Axio call to create or post data to api
 * @param formData
 * @returns
 */
const updateFormData = async (url: string, formData: any) => {
  const { data } = await axios.put(url, formData);
  return data;
};

/**
 * @description react-query hook to update a Certificate
 */
export default (options: { queriesToInvalidate?: string[]; successMessage?: string; redirectUrl?: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { url: string; formData?: any }) => updateFormData(data.url, data.formData),
    onSuccess: (data: any) => {
      console.log(options.queriesToInvalidate);
      message.success(options.successMessage || "Data updated successfully");
      options.queriesToInvalidate?.forEach((query: string) => {
        queryClient.invalidateQueries([query] as any);
      });
      if (options.redirectUrl) {
        router.push(options.redirectUrl);
      }
    },
    onError: (error: Error) => {
      errorHandler(error);
    },
  });
};
