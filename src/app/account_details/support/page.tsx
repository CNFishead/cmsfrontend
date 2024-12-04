import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import Support from "@/views/account_details/support/Support.view";

export default function Component() {
  return (
    <PageLayout pages={[navigation().account_details.links.support]} largeSideBar>
      <Support />
    </PageLayout>
  );
}
