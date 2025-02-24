import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import EventDetails from "@/views/events/eventDetails/EventDetails.screen";

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.events]}>
      <EventDetails />
    </PageLayout>
  );
}
