import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import Ministry from "@/views/ministry/Ministry.Screen";

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.ministries]}>
      <Ministry />
    </PageLayout>
  );
}
