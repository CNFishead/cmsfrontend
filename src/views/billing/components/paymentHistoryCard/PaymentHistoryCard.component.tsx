import Error from "@/components/error/Error.component";
import Loader from "@/components/loader/Loader.component";
import { Modal, Skeleton } from "antd";

import styles from "./PaymentHistoryCard.module.scss";
import { useTransactions, ITransaction } from "@/views/billing/hooks/useTransasctions";
import { useTransactionReceipt } from "@/views/billing/hooks/useTransactionReceipt";
import TransactionItem from "../transactionItem/TransactionItem.component";

/**
 * @description - This component displays the user's current features. It is a card component that is used in the billing page.
 * @author Austin howard
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Austin howard
 * @lastModifiedOn 06/01/2023
 */

const PaymentHistoryCard = () => {
  const { transactions, isLoading, isError, error } = useTransactions();
  const { handleDownload, isDownloading } = useTransactionReceipt();

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <Modal open={isDownloading} footer={null} closable={false} centered>
        <Loader />
      </Modal>

      {transactions?.map((transaction: ITransaction) => (
        <TransactionItem
          key={transaction._id}
          transaction={transaction}
          onDownloadReceipt={(transactionId) => {
            handleDownload(transaction);
          }}
        />
      ))}
    </div>
  );
};
export default PaymentHistoryCard;
