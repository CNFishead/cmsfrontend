import Members from "@/views/members/Members.screen";
import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";

export default function Home() {
  return (
    <PageLayout pages={[navigation().members.links.members]}>
      <Members />
    </PageLayout>
  );
}
