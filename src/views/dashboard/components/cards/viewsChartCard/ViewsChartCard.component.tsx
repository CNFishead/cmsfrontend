import styles from './ViewsChartCard.module.scss';
import { useDateRangeStore } from '@/state/analytics/dateRange';
import { PieChart, ResponsiveContainer, Pie, Tooltip } from 'recharts';
import { Button, Skeleton } from 'antd';
import { useEffect } from 'react';
import Link from 'next/link';
import Error from '@/components/error/Error.component';

type Props = {
  hook: any;
};

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: CustomizedLabelProps): JSX.Element => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ViewsChartCard = (props: Props) => {
  const { data: viewsData, error, isLoading, isError } = props.hook();
  useEffect(() => {
    console.log(viewsData);
  }, [viewsData]);

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.pieContainer}>
          <ResponsiveContainer width={'99%'} aspect={1}>
            <PieChart>
              <Pie
                dataKey="count"
                nameKey={'_id'}
                data={viewsData?.data.viewedFrom}
                labelLine={false}
                fill="#557797"
                label={renderCustomizedLabel}
                innerRadius={'40%'}
                outerRadius={'50%'}
                paddingAngle={2}
              />

              <Tooltip wrapperClassName={styles.toolTip} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.total}>
            <h1>
              {viewsData?.data.viewedFrom.reduce(
                (acc: any, curr: any) => acc + curr.count,
                0
              )}{' '}
            </h1>
          </div>
        </div>
      </div>
      <div className={styles.subscribersAmount}>
        {viewsData?.data.viewedFrom.map((item: any, index: any) => {
          return (
            <div
              key={index}
              className={styles.subGroup}
              style={{
                color: `#173c52`,
              }}
            >
              <h1>{item._id}</h1>
              <p>{item.count}</p>
            </div>
          );
        })}
      </div>
      <Link href={'/home/analytics?type=views'}>
        <Button type="text">View Analytics</Button>
      </Link>
    </div>
  );
};

export default ViewsChartCard;
