"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A simple area chart";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const BalanceChart = ({ balanceData }: { balanceData: any }) => {
  const updatedData = getChartData(balanceData);
  const chartData = updatedData.filter(
    (obj) =>
      obj.dates.slice(-2) >= "01" && obj.dates.slice(-2) <= new Date().getDate()
  );
  return (
    <Card className="md:w-2/3 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent className="h-60 md:h-full w-full flex flex-grow">
        <ResponsiveContainer height={"100%"} width={"100%"}>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="dates"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(-2)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="balance"
                type="bump"
                fill="var(--color-balance)"
                fillOpacity={0.6}
                stroke="var(--color-balance)"
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BalanceChart;

function getChartData(balanceData: BalanceChartData[]): BalanceChartData[] {
  const extendedData = [];
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startDate = new Date(balanceData[0].dates); // first date of the month or last date of recorded balance of last month
  const endDate = new Date(lastDay); // End date of current month
  let lastBalance = null;
  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const currentDate = date.toISOString().split("T")[0];
    const existingData = balanceData.find((item) => item.dates === currentDate);

    if (existingData) {
      lastBalance = existingData.balance;
      extendedData.push(existingData);
    } else {
      // If no data for the current date, use the last known balance
      if (lastBalance !== null) {
        extendedData.push({ dates: currentDate, balance: lastBalance });
      }
      // If there's no last balance then you are not displaying graph, so this is not required
    }
  }
  return extendedData;
}
