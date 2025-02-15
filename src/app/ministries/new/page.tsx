import PageLayout from "@/layout/page/Page.layout";
import MinistryDetails from "@/views/ministry/ministryDetails/MinistryDetails.view";
import { navigation } from "@/data/navigation";

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.ministries]}>
      <MinistryDetails />
    </PageLayout>
  );
}
