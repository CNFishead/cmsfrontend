import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import NotificationType from '@/types/NotificationType';

interface UseNotificationsReturn {
  notifications: NotificationType[];
  isLoading: boolean;
  error: any;
  markRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  refetch?: () => void;
}

const useNotifications = (): UseNotificationsReturn => {
  const { data: loggedInUser } = useUser();

  // Extract all values from profileRefs map and combine with user ID
  const getAllUserIds = () => {
    const userIds: string[] = [];

    // Add the main user ID
    if (loggedInUser?._id) {
      userIds.push(loggedInUser._id);
    }

    // Add all profile reference IDs
    if (loggedInUser?.profileRefs) {
      const profileRefValues = Object.values(loggedInUser.profileRefs).filter(Boolean) as string[];
      userIds.push(...profileRefValues);
    }

    return userIds;
  };

  const query = useApiHook({
    url: `/notification`,
    key: 'notifications',
    method: 'GET',
    filter: `userTo;{"$in":"${getAllUserIds().join(',')}"}`,
    enabled: !!loggedInUser?._id, // Only run query when user is loaded
  }) as any;

  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ['notifications'],
    key: 'notification-update',
    method: 'POST',
  }) as any;

  const markAllAsRead = () => {
    updateNotification({ url: '/notification/update/all' });
  };

  const markRead = (notificationId: string) => {
    updateNotification({
      url: `/notification/${notificationId}`,
      formData: { opened: true },
    });
  };

  return {
    notifications: query?.data?.payload || [],
    isLoading: query?.isLoading || false,
    error: query?.error,
    markAllAsRead,
    markRead,
    refetch: query?.refetch,
  };
};

export default useNotifications;
