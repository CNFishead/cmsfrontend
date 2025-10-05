import React from "react";
import styles from "./UserItem.module.scss";
import { Avatar, Button, Card, Tag, Tooltip } from "antd";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import MemberType from "@/types/MemberType";
import { FaEdit, FaEnvelope, FaPhone, FaClock, FaUser } from "react-icons/fa";
import Link from "next/link";
interface Props {
  user: MemberType;
  sm?: boolean;
  isLink?: boolean;
}

const UserItem = (props: Props) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastVisited = (date: string | Date) => {
    const visitDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return visitDate.toLocaleDateString();
  };

  if (props.sm) {
    const compactContent = (
      <div className={`${styles.compactCard} ${props.isLink ? styles.clickable : ""}`}>
        <div className={styles.compactAvatar}>
          {props.user?.profileImageUrl ? (
            <Avatar src={props.user.profileImageUrl} size={40} className={styles.avatar} />
          ) : (
            <Avatar size={40} className={styles.avatarFallback}>
              {getInitials(props.user?.fullName || "Unknown")}
            </Avatar>
          )}
        </div>
        <div className={styles.compactInfo}>
          <h4 className={styles.compactName}>{props.user?.fullName}</h4>
          <span className={styles.compactEmail}>{props.user?.email}</span>
        </div>
      </div>
    );

    return props.isLink ? (
      <Link href={`/members/${props.user?._id}`} className={styles.linkWrapper}>
        {compactContent}
      </Link>
    ) : (
      compactContent
    );
  }

  const cardContent = (
    <Card className={`${styles.userCard} ${props.isLink ? styles.clickable : ""}`} hoverable={props.isLink}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarSection}>
          {props.user?.profileImageUrl ? (
            <Avatar src={props.user.profileImageUrl} size={72} className={styles.avatar} />
          ) : (
            <Avatar size={72} className={styles.avatarFallback}>
              {getInitials(props.user?.fullName || "Unknown")}
            </Avatar>
          )}
          <div className={styles.onlineIndicator} />
        </div>

        <div className={styles.userDetails}>
          <div className={styles.nameSection}>
            <h3 className={styles.userName}>{props.user?.fullName}</h3>
            {props.user?.role && (
              <Tag color="blue" className={styles.roleTag}>
                <FaUser className={styles.roleIcon} />
                {props.user.role}
              </Tag>
            )}
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span className={styles.contactText}>{props.user?.email}</span>
            </div>

            {props.user?.phoneNumber && (
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span className={styles.contactText}>{formatPhoneNumber(props.user.phoneNumber)}</span>
              </div>
            )}
          </div>
        </div>
 
      </div>

      {props.user?.dateLastVisited && (
        <div className={styles.cardFooter}>
          <div className={styles.lastVisited}>
            <FaClock className={styles.clockIcon} />
            <span className={styles.visitedText}>Last visited {formatLastVisited(props.user.dateLastVisited)}</span>
          </div>
        </div>
      )}
    </Card>
  );

  return props.isLink ? (
    <Link href={`/members/${props.user?._id}`} className={styles.linkWrapper}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default UserItem;
