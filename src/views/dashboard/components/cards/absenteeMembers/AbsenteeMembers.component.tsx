import React from "react";
import styles from "./AbsenteeMembers.module.scss";
import Error from "@/components/error/Error.component";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";
import moment from "moment";
import MemberType from "@/types/MemberType";
import UserItem from "@/components/userItem/UserItem.component";

const AbsenteeMembers = () => {
  const { data: loggedInData } = useUser();
  const { data, isLoading, isError, error } = useApiHook({
    url: `/ministry/analytic/absentee-members`,
    key: "absenteeMembers",
    method: "GET",
    filter: `user;${loggedInData?._id}|dateLastVisited;{"$lte":"${moment().subtract(30, "days").toISOString()}"}`, // 30 days ago from today's date
    enabled: !!loggedInData?._id,
  }) as any;

  if (isError) return <Error error={error.message} />;
  if (isLoading) return <div className={styles.container}>Loading...</div>;
  return (
    <div className={styles.container}>
      {data?.payload?.length > 0 ? (
        <div className={styles.memberContainer}>
          {data?.payload?.map((member: MemberType) => (
            <UserItem key={member._id} user={member} />
          ))}
        </div>
      ) : (
        <div className={styles.noMembers}>Our Records dont indicate any users havent shown up in over 30 days!</div>
      )}
    </div>
  );
};

export default AbsenteeMembers;
