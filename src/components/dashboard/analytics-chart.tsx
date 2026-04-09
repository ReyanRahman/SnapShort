"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = {
  date: string;
  clicks: number;
};

export function AnalyticsChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="clicks" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#ff6a3d" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#ff6a3d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(17,17,17,0.08)" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="clicks" stroke="#ff6a3d" fill="url(#clicks)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
