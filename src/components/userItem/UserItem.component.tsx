import User from "@/types/User";
import React from "react";
import styles from "./UserItem.module.scss";
import { Avatar, Card, Divider } from "antd";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import MemberType from "@/types/MemberType";
interface Props {
  user: MemberType;
  sm?: boolean;
}

const UserItem = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.userImageContainer}>
          <Avatar src={props.user?.profileImageUrl} alt="user-profile-image" size={props.sm ? 48 : 64} />
        </div>
        <div className={styles.userDetailsContainer}>
          <div className={styles.header}>
            <div className={styles.channelDetails}>
              <p className={`ellipsis ${styles.name}`}>{props.user?.fullName}</p>
            </div>
          </div>
        </div>
        {!props.sm && (
          <div className={styles.miscInfoContainer}>
            <div className={styles.miscInfo}>
              <p>
                <strong>Email Address:</strong> {props.user?.email}
              </p>
              {props.user?.phoneNumber && (
                <p>
                  <strong>Phone: </strong>
                  {formatPhoneNumber(props.user?.phoneNumber)}
                </p>
              )}
              {props.user?.dateLastVisited && (
                <p>
                  <strong>Last Visited: </strong>
                  {new Date(props.user?.dateLastVisited).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserItem;
