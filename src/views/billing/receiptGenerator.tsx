import { pdf } from "@react-pdf/renderer";
import { ITransaction } from "@/views/billing/hooks/useTransasctions";
import { ReceiptDocument, type ReceiptData } from "./components/receiptDocument/ReceiptDocument.component";

/**
 * PDF receipt generator using @react-pdf/renderer
 */

/**
 * Generate PDF receipt using @react-pdf/renderer
 * Returns a Blob that can be downloaded or used as needed
 */
export const generatePDFReceipt = async (receiptData: ReceiptData): Promise<Blob> => {
  const pdfBlob = await pdf(<ReceiptDocument receiptData={receiptData} />).toBlob();
  return pdfBlob;
};

/**
 * Generate receipt filename based on transaction data
 */
export const generateReceiptFilename = (transaction: ITransaction): string => {
  const date = new Date(transaction.createdAt).toISOString().split("T")[0];
  const transactionId = transaction.transactionId || transaction._id;
  return `receipt-${transactionId}-${date}.pdf`;
};

// Re-export types and components for convenience
export type { ReceiptData } from "./components/receiptDocument/ReceiptDocument.component";
