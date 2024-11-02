import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import CreateNewMember from "@/views/members/views/createNewMember/CreateNewMember.view";

export default function Home() {
  return (
    <PageLayout pages={[navigation().members.links.members]} largeSideBar>
      <CreateNewMember />
    </PageLayout>
  );
}
