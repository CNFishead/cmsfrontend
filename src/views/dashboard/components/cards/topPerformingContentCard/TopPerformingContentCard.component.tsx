import { useState } from 'react';
import styles from './TopPerformingContentCard.module.scss';
import { Table, Segmented, Button, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import VideoStat from '@/components/videoStat/VideoStat.component';
import Image from 'next/image';
import Error from '@/components/error/Error.component';
import { useSearchStore } from '@/state/search/search';
import { useRouter } from 'next/navigation';

type Props = {
  hook: any;
};

const TopPerformingContentCard = (props: Props) => {
  const [chosenStat, setChosenStat] = useState('Views');
  const { data, error, isLoading, isError } = props.hook(
    chosenStat.toLowerCase()
  );
  const router = useRouter();
  const { modifySort } = useSearchStore();

  const onShowMore = () => {
    modifySort(`${chosenStat};asc`);
    router.push('/library');
  };
  interface DataType {
    key: string;
    title: {
      thumbnail: string;
      title: string;
    };
    views: number;
    likes: number;
    comments: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Image',
      dataIndex: 'videoImageUrl',
      key: 'image',

      render: (videoImageUrl) => {
        return (
          <div className={styles.videoThumbnail}>
            <Image
              src={videoImageUrl}
              width={75}
              height={50}
              className={styles.thumbnail}
              alt="video"
            />
          </div>
        );
      },
    },
    {
      title: 'Title',
      dataIndex: 'videoTitle',
      key: 'title',

      render: (title) => {
        return <p className={styles.title}>{title}</p>;
      },
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (amount) => {
        console.log(amount);
        return  <></> // <VideoStat type="Views" amount={amount} />;
      },
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      key: 'likes',
      render: (amount) =>  <></> // <VideoStat type="Likes" amount={amount} />,
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      render: (amount) =>  <></> // <VideoStat type="Comments" amount={amount} />,
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <Segmented
        value={chosenStat}
        defaultValue={chosenStat}
        className={styles.chooseStat}
        options={[
          { label: 'Views', value: 'Views' },
          { label: 'Likes', value: 'Likes' },
          { label: 'Comments', value: 'Comments' },
        ]}
        onChange={(val: any) => {
          setChosenStat(val);
        }}
      />
      <Table
        columns={columns}
        dataSource={data?.data}
        pagination={false}
        rowClassName={styles.tableRow}
        rootClassName={styles.table}
      />
      <Button type="text" className={styles.button} onClick={onShowMore}>
        Show More
      </Button>
    </div>
  );
};

export default TopPerformingContentCard;
