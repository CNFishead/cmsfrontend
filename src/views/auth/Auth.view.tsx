import { getAbsoluteUrl } from "@/utils/getAbsoluteUrl";
import { Button } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import styles from "./Auth.module.scss";

type Props = {
  fullUrl?: string;
};

const Auth = (props: Props) => {
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if there's a token and if we've already been redirected
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    const hasRedirected = typeof window !== "undefined" ? window.sessionStorage.getItem("auth_redirected") : null;

    // If there's a token but we're on this page, it means the token is invalid
    // Clear it and allow the user to try again
    if (token && !hasRedirected) {
      // Token exists but user is on auth page - likely invalid
      // Clear it after a short delay to allow for verification
      const timer = setTimeout(() => {
        window.localStorage.removeItem("token");
        setIsVerifying(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // No token or already redirected - ready to authenticate
      setIsVerifying(false);
      if (hasRedirected) {
        window.sessionStorage.removeItem("auth_redirected");
      }
    }
  }, []);

  const handleAuthClick = () => {
    // Set redirecting state and mark that we're about to redirect
    setIsRedirecting(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("auth_redirected", "true");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <div className={styles.iconCircle}>
              <SafetyOutlined className={styles.icon} />
            </div>
          </div>

          <div className={styles.logoContainer}>
            <Image
              src="/images/ShepherdsCMSLogo.png"
              width={140}
              height={90}
              style={{
                objectFit: "contain",
              }}
              alt="Shepherd CMS Logo"
              priority
            />
          </div>

          <div className={styles.content}>
            <h1 className={styles.title}>Authentication Required</h1>
            <p className={styles.description}>
              Your session has expired or you need to authenticate. Please sign in to continue accessing your dashboard.
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <LockOutlined className={styles.featureIcon} />
                <span>Secure Authentication</span>
              </div>
              <div className={styles.feature}>
                <SafetyOutlined className={styles.featureIcon} />
                <span>Protected Access</span>
              </div>
            </div>

            <a
              href={`${process.env.AUTH_URL}?redirect=${getAbsoluteUrl() + pathname}`}
              className={styles.buttonLink}
              onClick={handleAuthClick}
            >
              <Button
                className={styles.button}
                type="primary"
                size="large"
                icon={<LockOutlined />}
                loading={isVerifying || isRedirecting}
                disabled={isVerifying || isRedirecting}
                block
              >
                {isVerifying ? "Verifying..." : isRedirecting ? "Redirecting..." : "Sign In to Continue"}
              </Button>
            </a>

            <p className={styles.footerText}>You will be redirected back to your current page after authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

Auth.getInitialProps = async ({ req }: any) => {
  let fullUrl;
  if (req) {
    // Server side rendering
    fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  } else {
    // Client side rendering
    fullUrl =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");
  }
  return { fullUrl: fullUrl };
};
