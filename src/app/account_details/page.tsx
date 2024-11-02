import AccountDetails from "@/views/account_details/AccountDetails.screen";
import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";

export default function Home() {
  return (
    <PageLayout pages={[navigation().account_details.links.account_details]}>
      <AccountDetails />
    </PageLayout>
  );
}
