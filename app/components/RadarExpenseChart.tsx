"use client";
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useState } from "react";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RadarExpenseChart({ userRecords }: { userRecords: Records[] }) {
  const [duration, setDuration] = useState<string>("30");
  const chartData = processData(userRecords, duration);
  return (
    <Card className="md:min-w-[450px] lg:max-w-[650px] grow">
      <div className=" h-full flex flex-col">
        <CardHeader className="items-center pb-4 gap-2">
          <CardTitle>Expense by category</CardTitle>
          <CardDescription className="text-foreground">
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto bg-accent"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" className="" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-differ">
                <SelectItem value="7" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <div className="grow"></div>
        {chartData.length ? (
          <CardContent>
            <ChartContainer config={chartConfig}>
              <RadarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis dataKey="category" />
                <PolarGrid stroke="grey" gridType="circle" />
                <Radar
                  dataKey="total"
                  fill="var(--color-total)"
                  fillOpacity={0.9}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        ) : (
          <CardContent className="h-full justify-center items-center flex">
            <p>No expense in the last {duration} days</p>
          </CardContent>
        )}
        <div className="grow"></div>
      </div>
    </Card>
  );
}

function processData(
  records: Records[],
  duration: string
): { category: string; total: number }[] {
  let chartData: { category: string; total: number }[] = [];
  let obj: { [key: string]: number } = {};
  const referenceDate = new Date();
  referenceDate.setDate(referenceDate.getDate() - Number(duration));

  let filteredRecord = records.filter((record) => record.dates > referenceDate);

  filteredRecord.forEach((record) => {
    if (record.transtype === "expense") {
      if (!obj[record.category]) obj[record.category] = 0;
      obj[record.category] += record.value;
    }
  });

  for (let key in obj) {
    chartData.push({ category: key, total: obj[key] });
  }

  return chartData;
}
