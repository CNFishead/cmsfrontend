import NotificationsView from "@/views/notifications/NotificationsView.view";
import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shepherds CMS | Notifications",
  description: "Notifications for Shepherds CMS",
};

export default function Home() {
  return (
    <PageLayout pages={[navigation().home.links.notifications]} largeSideBar>
      <NotificationsView />
    </PageLayout>
  );
}
