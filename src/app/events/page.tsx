import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import Events from "@/views/events/Events.view";

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.events]}>
      <Events />
    </PageLayout>
  );
}
