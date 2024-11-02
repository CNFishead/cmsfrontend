import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation"; 
import Families from "@/views/family/Families.screen";

export default function Home() {
  return (
    <PageLayout pages={[navigation().members.links.families]} largeSideBar>
      <Families />
    </PageLayout>
  );
}
