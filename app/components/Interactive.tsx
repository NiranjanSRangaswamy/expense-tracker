"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";

import { Bold, Italic, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckedState } from "@radix-ui/react-checkbox";

const chartConfig = {
  income: {
    label: "income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "expense",
    color: "hsl(var(--chart-4))",
  },
  balance: {
    label: "balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Interactive({
  userRecords,
  balanceData,
}: {
  userRecords: Records[];
  balanceData: BalanceChartData[];
}) {
  const [timeRange, setTimeRange] = React.useState<string>("30d");
  const [selectedItems, setSelectedItems] = React.useState<string[]>([
    "income",
    "expense",
  ]);

  let chartData = processData(userRecords, balanceData);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row md:grid-cols-3 md:grid">
        <div className="grid  gap-1 text-center sm:text-left">
          <CardTitle>Transaction Chart</CardTitle>
          <CardDescription>
            Showing Balance, Income & Expense Chart
          </CardDescription>
        </div>
        <div className=" flex justify-center">
          <ToggleGroup
            type="multiple"
            value={selectedItems}
            onValueChange={setSelectedItems}
            className="bg-background p-1 rounded-lg"
            size={"sm"}
          >
            <ToggleGroupItem value="balance">Balance</ToggleGroupItem>
            <ToggleGroupItem value="income">Income</ToggleGroupItem>
            <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto bg-accent"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-differ">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {chartData.length ? (
            <LineChart
              accessibilityLayer
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {selectedItems.includes("balance") && (
                <Line
                  dataKey="balance"
                  type="monotone"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-balance)" }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedItems.includes("income") && (
                <Line
                  dataKey="income"
                  type="monotone"
                  stroke="var(--color-income)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-income)" }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedItems.includes("expense") && (
                <Line
                  dataKey="expense"
                  type="monotone"
                  stroke="var(--color-expense)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-expense)" }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          ) : (
            <div className="w-sc h-full flex justify-center items-center text-lg ">
              Please add transactions to view your spending graph
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function processData(
  records: Records[],
  balanceData: { dates: string; balance: number }[]
): ChartData[] {
  if (records.length === 0) return [];
  let extendedData: ChartData[] = [];
  let obj: { [key: string]: { [key: string]: number } } = {};

  records.forEach((record) => {
    //converting the date to local time of sweden to get in  the format of YYYY-MM-DD. indian format is DD/MM/YYYY
    let dateString: string = record.dates.toLocaleDateString("sv-SE");
    let transType: string = record.transtype;
    if (obj[dateString] === undefined) {
      obj[dateString] = { income: 0, expense: 0 };
    }
    obj[dateString][transType] += record.value;
  });

  balanceData.forEach((record) => {
    obj[record.dates]["balance"] = record.balance;
  });

  const start = new Date(records[0].dates);
  let startingDate = start.toLocaleDateString("sv-SE");
  let balance = obj[startingDate]["balance"];

  const today = new Date();
  today.setHours(23, 59, 59, 999); // changing to final moment to get the todays date if the start time is more than current time

  for (
    let date = new Date(start);
    date <= today;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toLocaleDateString("sv-SE");

    balance = obj[dateString] ? obj[dateString]["balance"] : balance;
    if (obj[dateString]) {
      extendedData.push({ date: dateString, ...obj[dateString] });
      balance = obj[dateString]["balance"];
    } else {
      extendedData.push({ date: dateString, income: 0, expense: 0, balance });
    }
  }
  return extendedData;
}
