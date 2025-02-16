import AbsenteeMembers from "./components/cards/absenteeMembers/AbsenteeMembers.component";
import MinistryAttendance from "./components/cards/ministryAttendance/MinistryAttendance.component";

export interface Card {
  title: string;
  component: React.ReactNode;
  gridKey: string;
  hideIf?: boolean;
}

export default [
  {
    title: "Ministry Attendance",
    component: <MinistryAttendance />,
    gridKey: "ministry-attendance",
    hideIf: false,
  },
  {
    title: "Absentee Members",
    component: <AbsenteeMembers />,
    gridKey: "absentee-members",
    hideIf: false,
  },
] as Card[];
