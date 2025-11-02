import NotificationType from '@/types/NotificationType';
import styles from './NotificationItem.module.scss';
import Link from 'next/link';
import React from 'react';
import { Avatar, Badge } from 'antd';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import useApiHook from '@/hooks/useApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '@/state/auth';
import useNotifications from '@/hooks/useNotifications';
import getNotificationLink from './getNotificationLink';

interface Props {
  notification: NotificationType;
  small?: boolean;
}
const NotificationItem = ({ notification, small = false }: Props) => {
  dayjs.extend(relativeTime);
  const { data: loggedInUser } = useUser();

  const { markRead } = useNotifications();
  // Check if notification is from system (no userFrom or userFrom is null)
  const isSystemNotification = !notification?.userFrom;
  const isUnread = !notification?.opened;

  // Check if we should use a link:
  // 1. System notifications need an entityId
  // 2. The notification link must resolve to something other than '/' or undefined
  const notificationLink = getNotificationLink(notification);
  const shouldUseLink =
    (!isSystemNotification || (isSystemNotification && notification?.entityId)) &&
    notificationLink &&
    notificationLink !== '/';
  const notificationContent = (
    <>
      {/* Unread indicator */}
      {isUnread && <div className={styles.unreadIndicator} />}

      {/* Avatar section */}
      <div className={styles.avatarSection}>
        <Badge dot={isUnread} offset={[-8, 8]} color="var(--color-metallic-blue)">
          {isSystemNotification ? (
            <Avatar
              size={small ? 'small' : 'default'}
              src="https://res.cloudinary.com/wulfdev/image/upload/v1760816772/ShepherdsCMSLogo_p3ipxo.png"
              className={styles.systemAvatar}
            />
          ) : (
            <Avatar
              size={small ? 'small' : 'default'}
              src={notification?.userFrom?.profileImageUrl}
              className={styles.userAvatar}
            />
          )}
        </Badge>
      </div>

      {/* Content section */}
      <div className={styles.contentSection}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.sender}>
              {isSystemNotification
                ? 'ShepherdCMS System'
                : `${notification?.userFrom?.firstName} ${notification?.userFrom?.lastName}`}
            </span>
            <div className={styles.timeStamp}>
              <ClockCircleOutlined className={styles.timeIcon} />
              <span>{dayjs(notification?.createdAt).fromNow()}</span>
            </div>
          </div>

          <h3 className={styles.title}>
            {isSystemNotification ? notification.message : notification.message}
          </h3>
        </div>

        {!isSystemNotification && notification.description && (
          <p className={styles.description}>{notification.description}</p>
        )}

        {/* If its already been read; dont show the hint */}
        {isUnread && (
          <div className={styles.actionHint}>
            <span>{shouldUseLink ? 'Click to view details' : 'Click to mark as read'}</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={styles.notificationWrapper}>
      {shouldUseLink ? (
        <Link
          className={`${styles.container} ${isUnread ? styles.unread : ''} ${
            isSystemNotification ? styles.systemNotification : ''
          } ${small ? styles.small : ''}`}
          href={notificationLink}
          onClick={() => {
            if (isUnread) {
              markRead(notification._id);
            }
          }}
        >
          {notificationContent}
        </Link>
      ) : (
        <div
          className={`${styles.container} ${isUnread ? styles.unread : ''} ${
            isSystemNotification ? styles.systemNotification : ''
          } ${small ? styles.small : ''} ${styles.nonClickable}`}
          onClick={() => {
            if (isUnread) {
              markRead(notification._id);
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          {notificationContent}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
