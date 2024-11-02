import styles from './SubscribersCard.module.scss';
import { Table, Button, Skeleton, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import Error from '@/components/error/Error.component';
import Link from 'next/link';
// import VideoStat from '@/components/videoStat/VideoStat.component';
import { BsFillPeopleFill } from 'react-icons/bs';

type Props = {
  hook: any;
};

const SubscribersCard = (props: Props) => {
  const { data: subscribersData, error, isLoading, isError } = props.hook();

  interface DataType {
    user: string;
    likes: string;
    watched: string;
    comments: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'user',
      render: (user) => {
        return <p className={styles.user}>{user}</p>;
      },
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes) => {
        return <></> // <VideoStat amount={likes} type="Likes" />;
      },
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments) => {
        return  <></> // <VideoStat amount={comments} type="Comments" />;
      },
    },
    {
      title: 'Watched',
      dataIndex: 'watchedVideos',
      key: 'watched',
      render: (watched) => {
        return  <></> // <VideoStat amount={watched} type="Views" />;
      },
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1>{subscribersData?.totalSubscribers}</h1>
        <BsFillPeopleFill className={styles.icon} />
      </div>
      <div className={styles.recentSubscribersContainer}>
        <div className={styles.recent}>
          <h1>Recent Subscribers</h1>
          <Table
            dataSource={subscribersData?.subscribers?.slice(0, 3)}
            pagination={false}
            columns={columns}
            className={styles.table}
          />
        </div>
      </div>
      <Link href="/home/subscribers">
        <Button type="text">View More</Button>
      </Link>
    </div>
  );
};

export default SubscribersCard;
