import { TabsProps } from "antd";
import MemberInfo from "./subviews/memberInfo/MemberInfo.component";
import Attendance from "./subviews/attendance/Attendance.component";

// exportable apps array constant
export default [
  {
    label: "Member Details",
    key: "1",
    children: <MemberInfo />,
  },
  {
    label: "Member Profile",
    key: "2",
  },
  {
    label: "Attendance",
    key: "3",
    children: <Attendance />,
  },
] as TabsProps["items"];
