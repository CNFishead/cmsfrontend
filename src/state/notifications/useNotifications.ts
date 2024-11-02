// import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
// import axios from '@/utils/axios';
// import { useQueryClient } from '@tanstack/react-query';
// import errorHandler from '@/utils/errorHandler';
// import { message } from 'antd';

// //query to retrieve a live video from the user
// export const fetchNotifications = async () => {
//   const { data } = await axios.get(`/notification`);

//   return data;
// };

// export const updateNotification = async (id?: string) => {
//   // if the id is provided update it. otherwise update
//   const url = id !== '' ? `/notification/${id}` : `/notification/all`;
//   const { data: notificationData } = await axios.put(url);

//   return notificationData;
// };

// /**
//  * @description - custom hook to retrieve the public profile of the current user
//  * @param onSuccess  - callback function to be called on success
//  * @param onError - callback function to be called on error
//  * @returns  - returns the query object
//  *
//  * @author Austin Howard
//  * @version 1.0
//  * @since 1.0
//  * @lastUpdated 2023-07-28T15:19:17.000-05:00
//  * @lastUpdatedBy Austin Howard
//  */
// export const useNotifications = (
//   onSuccess?: (data: any) => void,
//   onError?: (error: any) => void
// ) => {
//   const query = useQuery(['notificationList'], () => fetchNotifications(), {
//     onError,
//     refetchOnWindowFocus: true,
//     onSuccess,
//   });
//   return query;
// };

// export const useUpdateSelectedNotification = (
//   onSuccess?: (data: any) => void,
//   onError?: (error: any) => void
// ) => {
//   const queryClient = useQueryClient();
//   const mutate = useMutation(
//     (id: string) => {
//       return updateNotification(id);
//     },
//     {
//       onError: (error: any) => {
//         errorHandler(error);
//         onError && onError(error);
//       },
//       onSuccess: (data: any) => {
//         queryClient.invalidateQueries(['notificationList']);
//         onSuccess && onSuccess(data);
//       },
//     }
//   );
//   return mutate;
// };
