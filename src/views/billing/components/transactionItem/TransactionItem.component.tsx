import React from "react";
import { Button, Descriptions } from "antd";
import moment from "moment";
import { AiOutlineDownload } from "react-icons/ai";
import { ITransaction } from "@/views/billing/hooks/useTransasctions";
import styles from "./TransactionItem.module.scss";

interface TransactionItemProps {
  transaction: ITransaction;
  onDownloadReceipt?: (transactionId: string) => void;
}

const TransactionItem = ({ transaction, onDownloadReceipt }: TransactionItemProps) => {
  const getStatusBasedContent = () => {
    const date = formatDate(transaction.transactionDate);

    switch (transaction.status) {
      case "success":
      case "succeeded":
      case "completed":
        return {
          action: transaction.type === "payment" ? "Paid" : transaction.type === "refund" ? "Refunded" : "Processed",
          date: date,
          statusColor: "success",
        };

      case "pending":
        return {
          action: transaction.type === "payment" ? "Processing Payment" : `Processing ${transaction.type}`,
          date: date,
          statusColor: "pending",
        };

      case "failed":
        return {
          action: transaction.type === "payment" ? "Payment Failed" : `${transaction.type} Failed`,
          date: date,
          statusColor: "failed",
        };

      case "refunded":
        return {
          action: "Refunded",
          date: date,
          statusColor: "refunded",
        };

      case "voided":
        return {
          action: "Transaction Voided",
          date: date,
          statusColor: "voided",
        };

      default:
        return {
          action: transaction.type === "payment" ? "Payment" : `${transaction.type}ed`,
          date: date,
          statusColor: "default",
        };
    }
  };

  const formatDate = (date: Date) => {
    return moment(date).format("MM/DD/YYYY");
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount); // Assuming amount is in cents
  };

  const getPaymentMethod = () => {
    // Extract payment method from processor info
    return transaction.processor?.name || "N/A";
  };

  const getItemDescription = () => {
    // Use planInfo if available, otherwise use description
    if (transaction.planInfo) {
      return `${transaction.planInfo.planName} (${transaction.planInfo.billingCycle})`;
    }
    return transaction.description || "Payment";
  };

  const getTruncatedTransactionId = (id: string, maxLength: number = 20) => {
    if (id.length <= maxLength) return id;
    return `${id.substring(0, maxLength)}...`;
  };

  return (
    <div className={styles.receipt}>
      <div className={styles.details}>
        <div className={`${styles.date} ${styles[getStatusBasedContent().statusColor]}`}>
          <div>
            <h2>{getStatusBasedContent().action}</h2>
            <h1>{getStatusBasedContent().date}</h1>
          </div>
        </div>

        <Descriptions size="small" className={styles.paymentInfoContainer} contentStyle={{ minWidth: "80px" }}>
          <Descriptions.Item label="Transaction ID">
            <span title={transaction.transactionId}>{getTruncatedTransactionId(transaction.transactionId)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Item">{getItemDescription()}</Descriptions.Item>
          <Descriptions.Item label="Payment Method">{getPaymentMethod()}</Descriptions.Item>
          <Descriptions.Item label="Amount Paid">
            {formatAmount(transaction.amount, transaction.currency)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span className={`${styles.status} ${styles[transaction.status]}`}>{transaction.status}</span>
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.download}>
          <Button
            type="text"
            onClick={() => onDownloadReceipt?.(transaction._id)}
            disabled={!onDownloadReceipt}
            title="Download Receipt"
          >
            <AiOutlineDownload />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
