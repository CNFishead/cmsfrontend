import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import MemberDetails from "@/views/members/views/memberDetails/MemberDetails.component";
import FamilyContainer from "@/views/members/views/memberDetails/subviews/controlNav/FamilyContainer.component";
import { FaUserCog, FaUsers } from "react-icons/fa";
import { PiHandsPrayingFill } from "react-icons/pi";
import MemberSettings from "@/views/members/views/memberDetails/subviews/controlNav/MemberSettings.component";

export default function Home() {
  return (
    <PageLayout
      pages={[navigation().members.links.members]}
      controlNav={[
        {
          children: <FamilyContainer />,
          icon: <FaUsers />,
          title: "Member Family Information",
        },
        {
          children: <FamilyContainer />,
          icon: <PiHandsPrayingFill />,
          title: "Family Prayer Requests",
          disabled: true,
          hideIf: true,
        },
        {
          children: <MemberSettings />,
          icon: <FaUserCog />,
          title: "Member Settings",
        },
      ]}
    >
      <MemberDetails />
    </PageLayout>
  );
}
