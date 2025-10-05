import React, { useState, useMemo } from 'react';
import styles from './PolicyCheckWrapper.module.scss';
import { Modal, Checkbox, Button, Typography } from 'antd';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';

interface PolicyCheckWrapperProps {
  children: React.ReactNode;
}

const documentsToCheck = ['terms', 'privacy', 'refund'];

const PolicyCheckWrapper: React.FC<PolicyCheckWrapperProps> = ({ children }) => {
  const { data: loggedInData, isLoading: userIsLoading, refetch: refetchUser } = useUser();
  const { data: policies } = useApiHook({
    url: '/auth/legal',
    method: 'GET',
    key: ['legal', 'policies'],
    enabled: !!loggedInData,
  });

  // Build requiredPolicies object
  const requiredPolicies = useMemo(() => {
    const result: { [key: string]: { version: number; effective_date: string } } = {};
    if (policies?.payload) {
      policies.payload.forEach((policy: any) => {
        if (documentsToCheck.includes(policy.type)) {
          result[policy.type] = {
            version: policy.version,
            effective_date: policy.effective_date,
          };
        }
      });
    }
    return result;
  }, [policies]);

  // Find outdated or missing policies
  const documentsNeeded = useMemo(() => {
    if (userIsLoading || !loggedInData) return [];
    const needed: string[] = [];
    for (const doc of documentsToCheck) {
      const required = requiredPolicies[doc];
      const accepted = loggedInData?.acceptedPolicies?.[doc];
      if (required && (!accepted || accepted < required.version)) {
        needed.push(doc);
      }
    }
    return needed;
  }, [requiredPolicies, loggedInData, userIsLoading]);

  // Modal state
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Submit handler
  const { mutate: updatePolicies } = useApiHook({
    method: 'PUT',
    key: ['acceptPolicies'],
    queriesToInvalidate: ['user'],
  }) as any;

  const handleAccept = () => {
    if (!loggedInData) return;
    setSubmitting(true);
    // Build new acceptedPolicies map
    const newAcceptedPolicies = { ...(loggedInData.acceptedPolicies || {}) };
    documentsNeeded.forEach((doc) => {
      newAcceptedPolicies[doc] = requiredPolicies[doc].version;
    });
    updatePolicies(
      { url: `/user/${loggedInData._id}`, formData: { acceptedPolicies: newAcceptedPolicies } },
      {
        onSuccess: () => {
          setSubmitting(false);
          setCheckedDocs({});
          refetchUser();
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  // Modal content
  const showModal = documentsNeeded.length > 0;
  const allChecked = documentsNeeded.length > 0 && documentsNeeded.every((doc) => checkedDocs[doc]);

  // Handle checkbox change
  const handleCheckboxChange = (doc: string, checked: boolean) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: checked }));
  };

  return (
    <>
      <div className={styles.wrapper}>{children}</div>
      <Modal
        open={showModal}
        title={<span style={{ fontWeight: 600, fontSize: 20 }}>Policy Updates Required</span>}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        styles={{ body: { borderRadius: 12, background: '#fafcff', padding: 32 } }}
        style={{ width: 'auto', maxWidth: 800 }}
        wrapClassName={styles.policyModal}
      >
        <Typography.Paragraph style={{ marginBottom: 24 }}>
          You must read and accept the latest versions of the following policies to continue using the platform:
        </Typography.Paragraph>
        {documentsNeeded.map((doc, idx) => {
          // Find the full policy object for this doc
          const policyObj = policies?.payload?.find((p: any) => p.type === doc);
          return (
            <div
              key={doc}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                padding: '8px 0',
                borderBottom: idx < documentsNeeded.length - 1 ? '1px solid #eee' : 'none',
                gap: 16,
                wordBreak: 'break-word',
              }}
            >
              <Checkbox checked={!!checkedDocs[doc]} onChange={(e) => handleCheckboxChange(doc, e.target.checked)} style={{ marginRight: 16, marginTop: 2 }} />
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, minWidth: 0 }}>
                <div style={{ minWidth: 120, flex: '1 1 180px', wordBreak: 'break-word' }}>
                  <Typography.Text strong style={{ fontSize: 15 }}>
                    {policyObj?.title || doc}
                  </Typography.Text>
                </div>
                <div style={{ minWidth: 100, flex: '1 1 160px', wordBreak: 'break-word' }}>
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    Effective: {formatDate(policyObj?.effective_date)}
                  </Typography.Text>
                </div>
                <div style={{ minWidth: 80, flex: '1 1 100px', wordBreak: 'break-word' }}>
                  <a
                    href={`https://shepherdcms.org/legal/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1677ff', fontWeight: 500, wordBreak: 'break-word' }}
                  >
                    Read Policy
                  </a>
                </div>
              </div>
            </div>
          );
        })}
        <Button type="primary" block disabled={!allChecked || submitting} loading={submitting} onClick={handleAccept} style={{ marginTop: 8, fontWeight: 600, fontSize: 16 }}>
          Accept and Continue
        </Button>
      </Modal>
    </>
  );
};

export default PolicyCheckWrapper;
