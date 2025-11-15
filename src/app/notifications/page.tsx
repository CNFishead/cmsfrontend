import NotificationsView from "@/views/notifications/NotificationsView.view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shepherds CMS | Notifications",
  description: "Notifications for Shepherds CMS",
};

export default function Home() {
  return <NotificationsView />;
}
