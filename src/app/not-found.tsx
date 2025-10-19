'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './not-found.module.scss';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';

export default function NotFound() {
  const router = useRouter();
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a previous page in the browser history
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer && referrer !== window.location.href) {
        // Extract just the pathname for display
        try {
          const url = new URL(referrer);
          if (url.origin === window.location.origin) {
            setPreviousPage(url.pathname);
          }
        } catch (error) {
          console.error('Error parsing referrer:', error);
        }
      }
    }
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <PageLayout pages={[navigation().error_boundary.links.not_found]}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Error Code */}
          <div className={styles.errorCode}>
            <span className={styles.number}>4</span>
            <span className={styles.icon}>✝️</span>
            <span className={styles.number}>4</span>
          </div>

          {/* Main Message */}
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.subtitle}>
            It seems you&apos;ve taken a wrong turn on your ministry journey. The page you&apos;re
            looking for doesn&apos;t exist.
          </p>

          {/* Helpful Message */}
          <div className={styles.helpText}>
            <p>This could happen if:</p>
            <ul>
              <li>The page has been moved or deleted</li>
              <li>You typed the URL incorrectly</li>
              <li>You followed a broken link</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button onClick={handleGoHome} className={styles.primaryButton}>
              🏠 Go to Dashboard
            </button>

            {previousPage && (
              <button onClick={handleGoBack} className={styles.secondaryButton}>
                ← Go Back
              </button>
            )}

            {!previousPage && (
              <button onClick={handleGoBack} className={styles.secondaryButton}>
                ← Previous Page
              </button>
            )}
          </div>

          {/* Additional Help */}
          <div className={styles.footer}>
            <p>
              Need assistance with your ministry CMS?{' '}
              <a href="mailto:support@ministrycms.com" className={styles.link}>
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={styles.decoration}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
      </div>
    </PageLayout>
  );
}
