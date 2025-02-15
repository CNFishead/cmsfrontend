"use client";
import React from "react";
import styles from "./ControlNav.module.scss";
import MemberType from "@/types/MemberType";
import useApiHook from "@/state/useApi";
import { useParams } from "next/navigation";
import UserItem from "@/components/userItem/UserItem.component";
import Link from "next/link";

const FamilyContainer = () => {
  const { id } = useParams();
  const { data: selectedFamily } = useApiHook({
    url: `/family`,
    method: "GET",
    key: "memberFamily",
    enabled: !!id,
    filter: `members;{"$eq":"${id}"}`,
  }) as any;
  return (
    <div className={styles.subContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span>{selectedFamily?.payload[0]?.name}</span> Family
        </h3>
      </div>
      {selectedFamily?.payload[0]?.members
        ?.filter((member: MemberType) => member._id !== id)
        .map((member: MemberType) => {
          return (
            <div key={member._id} className={styles.memberContainer}>
              <Link href={`/members/${member._id}`} passHref>
                <UserItem user={member} sm />
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default FamilyContainer;
