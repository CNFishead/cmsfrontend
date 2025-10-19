"use client";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./MinistryAttendance.module.scss";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useApiHook from "@/state/useApi";
import MinistryType from "@/types/Ministry";
import { Select, DatePicker, Space, Typography, Empty, Spin } from "antd";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// Generate consistent colors for locations
const generateColor = (index: number): string => {
  const colors = [
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#f5222d",
    "#722ed1",
    "#13c2c2",
    "#eb2f96",
    "#fa8c16",
    "#a0d911",
    "#2f54eb",
  ];
  return colors[index % colors.length];
};

interface AttendanceEntry {
  date: string;
  checkIns: Record<string, number>;
}

interface TransformedData {
  date: string;
  [key: string]: string | number;
}

const MinistryAttendance = () => {
  const { selectedProfile } = useSelectedProfile();

  // Initialize dates: today and 30 days ago
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(30, "days"), dayjs()]);

  // Selected ministry ID - defaults to current profile
  const [selectedMinistryId, setSelectedMinistryId] = useState<string | undefined>(selectedProfile?._id);

  // Sync ministry ID with selected profile changes
  useEffect(() => {
    if (selectedProfile?._id && !selectedMinistryId) {
      setSelectedMinistryId(selectedProfile._id);
    }
  }, [selectedProfile?._id, selectedMinistryId]);

  // Fetch available ministries
  const { data: ministries, isLoading: isLoadingMinistries } = useApiHook({
    url: `/ministry`,
    key: ["ministries", "attendance", selectedProfile?._id || ""],
    enabled: !!selectedProfile?._id,
    method: "GET",
    include: `_id;${selectedProfile?._id}|ownerMinistry;${selectedProfile?._id}`,
  }) as any;

  // Fetch attendance data for selected ministry
  const { data: attendanceData, isLoading: isLoadingAttendance } = useApiHook({
    url: `/ministry/analytic/attendance/data`,
    key: ["attendanceData", selectedMinistryId || "", dateRange[0].toISOString(), dateRange[1].toISOString()],
    enabled: !!selectedMinistryId,
    staleTime: 1000 * 60 * 60, // 1 hour
    method: "GET",
    filter: `ministry;${selectedMinistryId}|date;{"$lte":"${dateRange[1].toISOString()}","$gte":"${dateRange[0].toISOString()}"}`,
  }) as any;

  // Get selected ministry name
  const selectedMinistryName = useMemo(() => {
    if (!ministries?.payload || !selectedMinistryId) return "Loading...";
    const ministry = ministries.payload.find((m: MinistryType) => m._id === selectedMinistryId);
    return ministry?.name || "Unknown Ministry";
  }, [ministries?.payload, selectedMinistryId]);

  // Transform attendance data for chart
  const chartData = useMemo<TransformedData[]>(() => {
    if (!attendanceData?.payload || !Array.isArray(attendanceData.payload)) return [];

    return attendanceData.payload.map((entry: AttendanceEntry) => ({
      date: dayjs(entry.date).format("MMM DD"),
      ...entry.checkIns,
    }));
  }, [attendanceData?.payload]);

  // Get all unique location types
  const locationTypes = useMemo<string[]>(() => {
    if (!attendanceData?.payload || !Array.isArray(attendanceData.payload)) return [];

    const types = new Set<string>();
    attendanceData.payload.forEach((entry: AttendanceEntry) => {
      Object.keys(entry.checkIns || {}).forEach((key) => types.add(key));
    });
    return Array.from(types);
  }, [attendanceData?.payload]);

  // Calculate total check-ins
  const totalCheckIns = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, entry) => {
      const dayTotal = locationTypes.reduce((daySum, location) => {
        return daySum + (Number(entry[location]) || 0);
      }, 0);
      return sum + dayTotal;
    }, 0);
  }, [chartData, locationTypes]);

  // Handle ministry selection change
  const handleMinistryChange = (value: string) => {
    setSelectedMinistryId(value);
  };

  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // Prepare ministry options for select
  const ministryOptions = useMemo(() => {
    if (!ministries?.payload) return [];
    return ministries.payload.map((ministry: MinistryType) => ({
      label: ministry.name,
      value: ministry._id,
    }));
  }, [ministries?.payload]);

  const isLoading = isLoadingMinistries || isLoadingAttendance;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title level={4} style={{ margin: 0 }}>
            Ministry Attendance
          </Title>
          <Text type="secondary">
            {selectedMinistryName} • {totalCheckIns} total check-ins
          </Text>
        </div>

        <Space className={styles.controls}>
          <RangePicker value={dateRange} onChange={handleDateRangeChange} format="MMM DD, YYYY" allowClear={false} />

          {ministryOptions.length > 0 && (
            <Select
              className={styles.dropdown}
              value={selectedMinistryId}
              onChange={handleMinistryChange}
              options={ministryOptions}
              showSearch
              placeholder="Select ministry"
              style={{ minWidth: 200 }}
              filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
            />
          )}
        </Space>
      </div>

      <div className={styles.chartContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" tip="Loading attendance data..." />
          </div>
        ) : chartData.length === 0 ? (
          <Empty description="No attendance data available for the selected period" style={{ margin: "40px 0" }} />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} label={{ value: "Check-ins", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
              {locationTypes.map((location, index) => (
                <Line
                  key={location}
                  type="monotone"
                  dataKey={location}
                  stroke={generateColor(index)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={location}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MinistryAttendance;
