import styles from './TotalCard.module.scss';
import Link from 'next/link';
import { Statistic, Skeleton } from 'antd'; 
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import Error from '@/components/error/Error.component';

type Props = {
  type: 'views' | 'likes' | 'videos';
  hook: any;
  icon: any;
};

const TotalCard = (props: Props) => {
  const { data, error, isLoading, isError } = props.hook();

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <Link
      className={styles.container}
      href={`/home/analytics?type=${props.type}`}
    >
      <div className={styles.totalContainer}>
        <h1 className={styles.amount}>{data?.total}</h1>
        <div className={styles.icon}>{props.icon}</div>
      </div>
      <div>
        <Statistic
          title="Year over year change"
          value={data?.percentChange}
          precision={2}
          valueStyle={{
            color:
              data?.percentChange === 0
                ? '#bebfbf'
                : data?.percentChange > 0
                ? '#3f8600'
                : '#cf1322',
          }}
          prefix={
            data?.percentChange === 0 ? (
              <></>
            ) : data?.percentChange > 0 ? (
              <AiOutlineArrowUp />
            ) : (
              <AiOutlineArrowDown />
            )
          }
          suffix="%"
        />
        <div className={styles.compare}>
          <p className={styles.compareItem}>
            <span>{data?.lastYear.date}:</span> {data?.lastYear.totalLastYear}
          </p>

          <p className={styles.compareItem}>
            <span>{data?.thisYear.date}:</span> {data?.thisYear.totalThisYear}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TotalCard;
