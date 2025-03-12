import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ResponsiveContainer } from "recharts";

interface NetworkConnectionChartProps {
    data: {
        date: string,
        count: number
    }[]
}

/**
 * This component utilises the data passed to create a bar chart
 * about the network connections over a period of time.
 *
 * This provides insight into the network activity of the system
 * and which days are the most active.
 * @param data - The data to be displayed on the chart.
 */
const NetworkConnectionsChart: React.FC<NetworkConnectionChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'API Calls per Day', angle: -90 }} />
                <Tooltip cursor={{ fill: "oklch(0.928 0.006 264.531)"}}/>
                <Bar dataKey="count" fill="#8884d8"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default NetworkConnectionsChart;