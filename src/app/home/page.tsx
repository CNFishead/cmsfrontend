import Dashboard from "@/views/dashboard/Dashboard.view";
import type { Metadata } from "next";
import DynamicTitleUpdater from "@/layout/dynamicTitleUpdater/DynamicTitleUpdater.layout";

export const metadata: Metadata = {
  title: "Shepherds CMS | Dashboard",
};

export default function Home() {
  return (
    <>
      <DynamicTitleUpdater baseTitle="ShepherdCMS | Dashboard" />
      <Dashboard />
    </>
  );
}
