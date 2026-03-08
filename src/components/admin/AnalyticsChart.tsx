"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type ChartData = {
    name: string;
    completed: number;
};

export function AnalyticsChart({ data }: { data: ChartData[] }) {
    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground border dashed rounded-xl">
                No course data available for visualization.
            </div>
        );
    }

    return (
        <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(10, 15, 28, 0.9)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        itemStyle={{ color: '#60A5FA' }}
                    />
                    <Bar
                        dataKey="completed"
                        name="Learners Completed"
                        fill="url(#colorUv)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                    />
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
