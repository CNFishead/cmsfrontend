import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation"; 
import SupportDetails from "@/views/account_details/support/supportDetails/SupportDetails.view";

export default function Component() {
  return (
    <PageLayout pages={[navigation().account_details.links.support]} largeSideBar>
      <SupportDetails />
    </PageLayout>
  );
}
