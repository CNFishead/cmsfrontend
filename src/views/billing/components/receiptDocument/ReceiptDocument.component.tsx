import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ITransaction } from "@/views/billing/hooks/useTransasctions";

export interface ReceiptData {
  transaction: ITransaction;
  companyInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#0066CC",
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 11,
    color: "#666666",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  receiptInfo: {
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555555",
    flex: 1,
  },
  rowValue: {
    fontSize: 12,
    color: "#333333",
    flex: 1,
    textAlign: "right",
  },
  amountRow: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#0066CC",
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555555",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066CC",
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: 11,
  },
  statusSuccess: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
  },
  statusPending: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
  },
  statusFailed: {
    backgroundColor: "#F8D7DA",
    color: "#721C24",
  },
  statusRefunded: {
    backgroundColor: "#D1ECF1",
    color: "#0C5460",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#666666",
    textAlign: "center",
    marginBottom: 8,
  },
  footerBold: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
});

/**
 * Format currency amount with proper locale and currency symbol
 */
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount); // Assuming amount is in cents
};

/**
 * Format date with proper locale formatting
 */
export const formatDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// PDF Receipt Component
export const ReceiptDocument: React.FC<{ receiptData: ReceiptData }> = ({ receiptData }) => {
  const { transaction, companyInfo } = receiptData;
  const company = companyInfo || {
    name: "Free Agent Portal",
    email: "support@freeagentportal.com",
  };

  const getStatusStyle = (status: string) => {
    const baseStyle = styles.status;
    switch (status.toLowerCase()) {
      case "success":
      case "succeeded":
      case "completed":
        return [baseStyle, styles.statusSuccess];
      case "pending":
        return [baseStyle, styles.statusPending];
      case "failed":
      case "voided":
        return [baseStyle, styles.statusFailed];
      case "refunded":
        return [baseStyle, styles.statusRefunded];
      default:
        return baseStyle;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Payment Receipt</Text>
          <Text style={styles.companyName}>{company.name}</Text>
          {company.email && <Text style={styles.companyInfo}>{company.email}</Text>}
          {company.phone && <Text style={styles.companyInfo}>{company.phone}</Text>}
          {company.address && <Text style={styles.companyInfo}>{company.address}</Text>}
        </View>

        {/* Receipt Information */}
        <View style={styles.receiptInfo}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Transaction ID:</Text>
            <Text style={styles.rowValue}>{transaction.transactionId || transaction._id}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date & Time:</Text>
            <Text style={styles.rowValue}>{formatDate(transaction.createdAt)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status:</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={getStatusStyle(transaction.status)}>{transaction.status}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment Type:</Text>
            <Text style={styles.rowValue}>{transaction.type}</Text>
          </View>

          {transaction.description && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Description:</Text>
              <Text style={styles.rowValue}>{transaction.description}</Text>
            </View>
          )}

          {transaction.planInfo && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Plan:</Text>
              <Text style={styles.rowValue}>
                {transaction.planInfo.planName} ({transaction.planInfo.billingCycle})
              </Text>
            </View>
          )}

          {transaction.processor && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Payment Method:</Text>
              <Text style={styles.rowValue}>{transaction.processor.name}</Text>
            </View>
          )}

          <View style={[styles.row, styles.amountRow]}>
            <Text style={styles.amountLabel}>Total Amount:</Text>
            <Text style={styles.amountValue}>{formatCurrency(transaction.amount, transaction.currency)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBold}>Thank you for your business!</Text>
          <Text style={styles.footerText}>This is an official receipt for your payment.</Text>
          {company.email && <Text style={styles.footerText}>Questions? Contact us at {company.email}</Text>}
          <Text style={styles.footerText}>Receipt generated on {formatDate(new Date())}</Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Generate receipt filename based on transaction data
 */
export const generateReceiptFilename = (transaction: ITransaction, format: "pdf" | "html" = "pdf"): string => {
  const date = new Date(transaction.createdAt).toISOString().split("T")[0];
  const transactionId = transaction.transactionId || transaction._id;
  return `receipt-${transactionId}-${date}.pdf`;
};
