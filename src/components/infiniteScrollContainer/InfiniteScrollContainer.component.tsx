import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import Error from '@/components/error/Error.component';
import Loader from '@/components/loader/Loader.component';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInView } from 'react-intersection-observer';
import { useSearchStore } from '@/state/search/search';
import styles from './InfiniteScrollContainer.module.scss';

/**
 * A container component that provides infinite scrolling functionality.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.hook - The hook function that provides the data and pagination functionality.
 * @param {string} props.dataKey - The key used to access the data in the hook's query result.
 * @param {string} [props.dataKey2] - An optional second key used to access additional data in the hook's query result.
 * @param {boolean} [props.needsDataParam] - Whether the data brought back from the hook function requires a data parameter.
 * @param {Object} [props.hookParams] - Additional parameters to pass to the hook function.
 * @param {Function} props.render - The function that renders each item in the data array.
 * @param {Function} [props.render2] - An optional function that renders each item in the additional data array.
 */

type Props = {
  hook: any;
  dataKey: string;
  dataKey2?: string;
  needsDataParam?: boolean;
  hookParams?: any;
  render: (data, index) => React.ReactNode;
  render2?: (data, index) => React.ReactNode;
  grid?: boolean;
};

const InfiniteScrollContainer = (props: Props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = props.hook(props.hookParams);
  const { ref, inView } = useInView();
  const { setPageNumber, pageNumber } = useSearchStore((state) => state);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isLoading &&
      isSuccess
    ) {
      setPageNumber(pageNumber + 1);
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    setPageNumber(1);

    return () => {
      setPageNumber(1);
    };
  }, []);

  const getPage = (page, dataKey) => {
    return props.dataKey !== ''
      ? props.needsDataParam
        ? page[dataKey][props.needsDataParam ? 'data' : '']
        : page[dataKey]
      : page;
  };

  if (isLoading || data.pages.length === 0) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  const content =
    isSuccess &&
    data?.pages?.map((page) =>
      getPage(page, props.dataKey).map((d, i) => {
        if (getPage(page, props.dataKey).length === i + 1) {
          return (
            <div ref={ref} key={i}>
              {props.render(d, i)}
            </div>
          );
        }
        return <div key={i}>{props.render(d, i)}</div>;
      })
    );
  const content2 =
    isSuccess &&
    props.dataKey2 &&
    data?.pages?.map((page) =>
      getPage(page, props.dataKey2).map((d, i) => {
        if (getPage(page, props.dataKey2).length === i + 1) {
          return (
            <div ref={ref} key={i}>
              {props.render2!(d, i)}
            </div>
          );
        }
        return <div key={i}>{props.render2!(d, i)}</div>;
      })
    );

  return (
    <div className={props.grid ? styles.grid : ''}>
      {content}
      {props.dataKey2 && content2}
      {isFetchingNextPage && <Loader />}
    </div>
  );
};

export default InfiniteScrollContainer;
