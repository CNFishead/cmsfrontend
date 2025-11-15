import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import "@/styles/nprogress.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import DynamicTitleUpdater from "@/layout/dynamicTitleUpdater/DynamicTitleUpdater.layout";
import AppWrapper from "@/layout/appWrapper/AppWrapper";
import { Suspense } from "react";
import { ControlNavProvider } from "@/providers/ControlNavProvider";
import PageWrapper from "@/layout/pageWrapper/PageWrapper.layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shepherds CMS",
  description: "Church managment software designed for the modern church.",
  keywords: ["church", "management", "software", "shepherds"],
  icons: {
    icon: "/favicon.ico", // favicon in the public folder
    apple: "/apple-touch-icon.png", // other icons in the public folder
    shortcut: "/favicon-32x32.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={null}>
          <DynamicTitleUpdater baseTitle="Shepherds CMS" />
          <ReactQueryProvider>
            <ControlNavProvider>
              <PageWrapper>{children}</PageWrapper>
            </ControlNavProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
