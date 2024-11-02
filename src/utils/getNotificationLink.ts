import NotificationType from '@/types/NotificationType';

export default (notification: NotificationType) => {
  switch (notification.notificationType) {
    case 'comment':
      return `/video/${notification.entityId}`;
    case 'video':
      return `/video/${notification.entityId}`;
    case 'channel':
      return `/channel/${notification.entityId}`;
    case 'playlist':
      return `/playlist/${notification.entityId}`;
    case 'info':
      return '#';
    case 'ministry-profile':
      return `/ministry-profile`;
    default:
      return '/';
  }
};
