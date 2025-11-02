import { useMutation } from "@tanstack/react-query";
import { useInterfaceStore } from "../../../state/interface";
import { ITransaction } from "./useTransasctions";
import axios from "@/utils/axios";
import { generatePDFReceipt, generateReceiptFilename, type ReceiptData } from "../receiptGenerator";

interface DownloadReceiptProps {
  transactionId: string;
}

interface ReceiptApiResponse {
  payload: ITransaction;
  success: boolean;
}

interface ReceiptResponse {
  transaction: ITransaction;
  filename: string;
  contentType: string;
}

/**
 * Hook for downloading transaction receipts with proper error handling
 */
export const useDownloadReceipt = () => {
  const { addAlert } = useInterfaceStore();

  // Mutation for downloading receipts
  const downloadReceiptMutation = useMutation({
    mutationFn: async ({ transactionId }: DownloadReceiptProps): Promise<ReceiptResponse> => {
      const response = await axios.get(`/payment/receipt/${transactionId}`, {
        timeout: 30000, // 30 second timeout for large files
      });

      const apiResponse: ReceiptApiResponse = response.data;

      if (!apiResponse.success || !apiResponse.payload) {
        throw new Error("Failed to retrieve receipt data");
      }

      // Generate filename using utility functions (PDF only)
      const transaction = apiResponse.payload;
      const filename = generateReceiptFilename(transaction);
      const contentType = "application/pdf";

      return {
        transaction,
        filename,
        contentType,
      };
    },
    onSuccess: async (data, variables) => {
      try {
        // Prepare receipt data
        const receiptData: ReceiptData = {
          transaction: data.transaction,
          companyInfo: {
            name: "Free Agent Portal",
            email: "support@freeagentportal.com",
          },
        };

        // Generate PDF receipt
        const pdfBlob = await generatePDFReceipt(receiptData);

        downloadFileFromBlob(pdfBlob, data.filename);
        addAlert({
          type: "success",
          message: `Receipt downloaded successfully: ${data.filename}`,
          duration: 5000,
        });
      } catch (error) {
        console.error("Error downloading file:", error);
        addAlert({
          type: "error",
          message: "Download failed - There was an error saving the receipt file",
          duration: 5000,
        });
      }
    },
    onError: (error: any) => {
      console.error("Receipt download error:", error);

      let errorMessage = "Failed to download receipt";
      let errorDescription = "Please try again later";

      if (error.response?.status === 404) {
        errorMessage = "Receipt not found";
        errorDescription = "This transaction may not have a receipt available";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request";
        errorDescription = "Please check the transaction details and try again";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Download timeout";
        errorDescription = "The receipt download took too long. Please try again";
      }

      addAlert({
        type: "error",
        message: `${errorMessage}: ${errorDescription}`,
        duration: 5000,
      });
    },
  });

  // Download file from Blob (for PDF downloads)
  const downloadFileFromBlob = (blob: Blob, filename: string) => {
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Simple download function
  const downloadReceipt = (transactionId: string) => {
    downloadReceiptMutation.mutate({ transactionId });
  };

  // Download with transaction context for better error handling
  const downloadReceiptWithContext = (transaction: ITransaction) => {
    if (!transaction._id) {
      addAlert({
        type: "error",
        message: "Invalid transaction - Cannot download receipt for this transaction",
        duration: 5000,
      });
      return;
    }

    downloadReceiptMutation.mutate({
      transactionId: transaction._id,
    });
  };

  return {
    downloadReceipt,
    downloadReceiptWithContext,
    isDownloading: downloadReceiptMutation.isPending,
    error: downloadReceiptMutation.error,
    isError: downloadReceiptMutation.isError,
    reset: downloadReceiptMutation.reset,
  };
};

export default useDownloadReceipt;
