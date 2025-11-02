import { useDownloadReceipt } from './useDownloadReceipt';
import { ITransaction } from './useTransasctions';

/**
 * Enhanced hook for transaction receipt downloads with additional utilities
 */
export const useTransactionReceipt = () => {
  const { downloadReceipt, downloadReceiptWithContext, isDownloading, error, isError, reset } = useDownloadReceipt();

  // Quick download handler for transaction items
  const handleDownload = (transaction: ITransaction) => {
    // Only allow downloads for successful transactions
    const allowedStatuses = ['success', 'succeeded', 'completed', 'refunded'];

    if (!allowedStatuses.includes(transaction.status)) {
      console.warn(`Cannot download receipt for transaction with status: ${transaction.status}`);
      return false;
    }

    downloadReceiptWithContext(transaction);
    return true;
  };

  // Bulk download handler (for future use)
  const handleBulkDownload = (transactions: ITransaction[]) => {
    const validTransactions = transactions.filter((t) => ['success', 'succeeded', 'completed', 'refunded'].includes(t.status));

    // Download each transaction sequentially with a small delay
    validTransactions.forEach((transaction, index) => {
      setTimeout(() => {
        downloadReceiptWithContext(transaction);
      }, index * 500); // 500ms delay between downloads
    });

    return validTransactions.length;
  };

  // Check if receipt is downloadable
  const isReceiptAvailable = (transaction: ITransaction): boolean => {
    const allowedStatuses = ['success', 'succeeded', 'completed', 'refunded'];
    return allowedStatuses.includes(transaction.status) && !!transaction._id;
  };

  return {
    handleDownload,
    handleBulkDownload,
    isReceiptAvailable,
    downloadReceipt,
    downloadReceiptWithContext,
    isDownloading,
    error,
    isError,
    reset,
  };
};

export default useTransactionReceipt;
