import axios from "@/utils/axios";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import errorHandler from "@/utils/errorHandler";
import { useRouter } from "next/navigation";

/**
 * @description Axio call to create or post data to api
 * @param formData
 * @returns
 * @todo add types
 */
const deleteData = async (url: string, formData: any) => {
  const { data } = await axios.delete(url, formData);
  return data;
};

/**
 * @description react-query hook to update a Certificate
 */
export default (options: { queriesToInvalidate?: string[]; successMessage?: string; redirectUrl?: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { url: string; formData?: any }) => deleteData(data.url, data.formData),
    onSuccess: (data: any) => {
      message.success(options.successMessage || "Data Removed successfully");
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
