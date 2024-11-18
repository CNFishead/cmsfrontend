import React from "react";
import styles from "../MinistryDetails.module.scss";
import UserItem from "@/components/userItem/UserItem.component";
import useApiHook from "@/state/useApi";
import MemberType from "@/types/MemberType";
import { Divider, Empty } from "antd";
import { useParams } from "next/navigation";

const Members = () => {
  const { id } = useParams();

  const { data: ministryData } = useApiHook({
    url: `/ministry/${id}`,
    key: "ministry",
    enabled: !!id,
    method: "GET",
  }) as any;

  return (
    <div>
      <Divider orientation="left">Members</Divider>
      {ministryData?.ministry?.members.map((member: MemberType) => (
        <UserItem key={member._id} user={member} />
      ))}
      {ministryData?.ministry?.members.length === 0 ||
        (!ministryData && (
          <div className={styles.noMembers}>
            <Empty description="No Members" />
          </div>
        ))}
    </div>
  );
};

export default Members;
