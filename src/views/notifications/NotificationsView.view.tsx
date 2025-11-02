'use client';
import Container from '@/layout/container/Container.layout';
import styles from './NotificationsView.module.scss';
import { Button, Empty } from 'antd';
import NotificationItem from '@/components/notificationItem/NotificationItem.component';
import NotificationType from '@/types/NotificationType';
import useNotifications from '@/hooks/useNotifications';

const NotificationsView = () => {
  const { notifications, markAllAsRead } = useNotifications();

  return (
    <Container
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
            }}
          >
            Notifications
          </span>
          <Button type="primary" onClick={markAllAsRead}>
            Mark all Read
          </Button>
        </div>
      }
    >
      <div className={styles.notifications}>
        {notifications?.length > 0 ? (
          notifications.map((notification: NotificationType) => {
            return <NotificationItem notification={notification} key={notification.entityId} />;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no notifications" />
        )}
      </div>
    </Container>
  );
};

export default NotificationsView;
