import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import FamilyEdit from "@/views/family/familyEditScreen/FamilyEdit.screen";

export default function Home() {
  return (
    <PageLayout pages={[navigation().members.links.families]} largeSideBar>
      <FamilyEdit />
    </PageLayout>
  );
}
