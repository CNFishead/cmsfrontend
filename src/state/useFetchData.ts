import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";
import { useSearchStore as store } from "./search/search";
import decryptData from "@/utils/decryptData";

const fetchData = async (options?: {
  url?: string;
  defaultKeyword?: string;
  defaultPageNumber?: number;
  defaultPageLimit?: number;
  defaultFilter?: string;
  defaultSort?: string;
  defaultInclude?: string;
}) => {
  const keyword = options?.defaultKeyword || store.getState().search;
  const pageNumber = options?.defaultPageNumber || store.getState().pageNumber;
  const pageLimit = options?.defaultPageLimit || store.getState().pageLimit;
  const include = options?.defaultInclude || store.getState().include;
  // if there is a default filter, and a store filter, we need to use both, otherwise we can use the values provided
  const filter = `${options?.defaultFilter ?? ""}${store.getState().filter ? `|${store.getState().filter}` : ""}`;
  // const filter = options?.defaultFilter || store.getState().filter;
  const sort = options?.defaultSort || store.getState().sort;

  const { data } = await axios.get(
    `${options?.url}?keyword=${keyword}` +
      `&pageNumber=${pageNumber}` +
      `&limit=${pageLimit}` +
      `&filterOptions=${filter}` +
      `&sortBy=${sort}` +
      `&includeOptions=${include}`
  );
  // if the data.payload is a string, attempt to decrypt it
  if (typeof data.payload === "string") {
    data.payload = JSON.parse(decryptData(data.payload));
    return data;
  }
  return data;
};

/**
 * @description - custom hook to retrieve information from api
 * @param keyword - search keyword
 * @param pageNumber - page number, used for pagination
 * @param onSuccess  - callback function to be called on success
 * @param onError - callback function to be called on error
 * @returns  - returns the query object
 *
 * @author Austin Howard
 * @version 1.0
 * @since 1.0
 */
export default (options?: {
  key: string | string[];
  url?: string;
  enabled?: boolean;
  keyword?: string;
  pageNumber?: number;
  pageLimit?: number;
  filter?: string;
  include?: string;
  sort?: string;
  refetchOnWindowFocus?: boolean;
}) => {
  const key =
    typeof options?.key === "string"
      ? [options?.key]
      : // if its an array, remove the array, return both elements as separate strings
        // example ["key1", "key2"] => "key1", "key2"
        options?.key.map((key) => key) || [];
  const query = useQuery({
    queryKey: key,
    queryFn: () =>
      fetchData({
        url: options?.url,
        defaultFilter: options?.filter,
        defaultKeyword: options?.keyword,
        defaultPageLimit: options?.pageLimit,
        defaultPageNumber: options?.pageNumber,
        defaultSort: options?.sort,
        defaultInclude: options?.include,
      }),
    meta: {
      errorMessage: "An error occurred while fetching data",
    },
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
    retry: 1,
    enabled: options?.enabled,
  });
  return query;
};
