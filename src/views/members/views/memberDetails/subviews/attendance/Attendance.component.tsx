"use client";
import useApiHook from "@/state/useApi";
import MinistryType from "@/types/Ministry";
import { useParams } from "next/navigation";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Line } from "recharts";

const Attendance = () => {
  const { id } = useParams();
  const { data: attendanceData, isLoading } = useApiHook({
    url: `/member/data`,
    key: ["attendance", `${id}`],
    method: "GET",
    enabled: !!id,
    filter: `member;${id}`,
  }) as any;
  const transformedData = attendanceData?.payload
    ?.map((entry) => {
      const ministriesObj: Record<string, number> = { date: entry.date };

      entry.ministries.forEach((ministry) => {
        ministriesObj[ministry.name] = ministry.count; // Ministry name as key, count as value
      });

      return ministriesObj;
    })
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ASC;
  const ministryNames = Array.from(
    new Set(attendanceData?.payload?.flatMap((entry) => entry.ministries.map((m) => m.name)))
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        style={{ backgroundColor: "#fefefe", borderRadius: "10px", padding: "10px" }}
      >
        <CartesianGrid strokeDasharray="6 6" />
        <XAxis dataKey="date" minTickGap={20} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {ministryNames.map((ministry, index) => (
          <Bar
            key={index}
            dataKey={ministry as keyof MinistryType}
            stackId="a"
            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            barSize={100}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Attendance;
