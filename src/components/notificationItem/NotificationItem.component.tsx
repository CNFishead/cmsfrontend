import NotificationType from "@/types/NotificationType";
import styles from "./NotificationItem.module.scss";
import moment from "moment";
import Link from "next/link";
import React from "react";
import getNotificationLink from "@/utils/getNotificationLink";
import { Avatar } from "antd";
import useUpdateData from "@/state/useUpdateData";
import useApiHook from "@/state/useApi";

interface Props {
  notification: NotificationType;
  small: boolean;
}
const NotificationItem = (props: Props) => {
  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ["notifications"],
    method: "PUT",
    key: "notification",
    url: props.notification._id !== "" ? `/notification/${props.notification._id}` : `/notification/all`,
  }) as any;
  return (
    <>
      <Link
        className={`${styles.container} ${!props.notification?.opened ? styles.unread : ""}`}
        href={getNotificationLink(props.notification)}
        key={props.notification.entityId}
        onClick={() => {
          updateNotification({
            formData: { opened: true },
          });
        }}
      >
        <div className={styles.content}>
          <div className={styles.titleContainer}>
            <Avatar size="small" src={props.notification?.userFrom?.profileImageUrl} />

            <h1 className={`${styles.title}  ${props.small ? styles.small : ""}`}>{props.notification.message}</h1>
          </div>

          <p className={`${styles.description} ${props.small ? styles.small : ""}`}>{props.notification.description}</p>
        </div>
        <div className={styles.date}>{moment(props.notification?.createdAt).format("MM/DD/YYYY").toString()}</div>
      </Link>
    </>
  );
};

// default props
NotificationItem.defaultProps = {
  small: false,
};

export default NotificationItem;
