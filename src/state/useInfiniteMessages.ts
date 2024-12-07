import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";

const fetchMessages = async ({ pageParam = 1, queryKey }) => {
  const ticketId = queryKey[1]; // Pass ticket ID dynamically
  const { data } = await axios.get(`/support/ticket/${ticketId}/message`, {
    params: { pageNumber: pageParam, limit: 10 },
  }); 
  /**
   *  Api has a structured respoonse like this:
   *  {
   *   success: true,
   *   payload: {
   *      data: data.entries,
   *       page,
   *       pages: Math.ceil(data.metadata[0]?.totalCount / pageSize) || 0,
   *      totalCount: data.metadata[0]?.totalCount || 0,
   *      // pages: Math.ceil(count / pageSize),
   *      prevPage: page - 1,
   *      nextPage: page + 1,
   * }}
   */
  return {
    data: data.payload.data,
    nextPage: data.payload.nextPage,
    hasMore: data.payload.hasMore,
  }; // Ensure your API returns { data: messages, nextPage: pageNumber, hasMore: boolean }
};

export const useMessages = (ticketId: string) =>
  useInfiniteQuery({
    queryKey: ["messages", ticketId],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.nextPage;
    },
    initialPageParam: 0,
    enabled: !!ticketId,
  });
