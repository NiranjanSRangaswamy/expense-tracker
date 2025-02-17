"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { PieSectorDataItem } from "recharts/types/polar/Pie";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface PieChartData {
  total: number;
  category: string;
  fill: string | undefined;
}

const chartConfig = {
  total: {
    label: "Rupees",
  },
  Food: {
    label: "Food & Drinks",
    color: "hsl(var(--chart-1))",
  },
  Shoping: {
    label: "Shoping",
    color: "hsl(var(--chart-2))",
  },
  Housing: {
    label: "Housing",
    color: "hsl(var(--chart-3))",
  },
  Transportation: {
    label: "Transportation",
    color: "hsl(var(--chart-4))",
  },
  Vehicle: {
    label: "Vehicle",
    color: "hsl(var(--chart-5))",
  },
  Life: {
    label: "Life & Entertainement",
    color: "hsl(var(--chart-1))",
  },
  Financial: {
    label: "Financial expenses",
    color: "hsl(var(--chart-2))",
  },
  Communication: {
    label: "Communication, PC",
    color: "hsl(var(--chart-3))",
  },
  Investments: {
    label: "Investments",
    color: "hsl(var(--chart-4))",
  },
  Income: {
    label: "Income",
    color: "hsl(var(--chart-5))",
  },
  miscellaneous: {
    label: "Miscellaneous",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// const chartData = [
//   { category: "chrome", tota: 275, fill: "var(--color-chrome)" },
//   { category: "safari", tota: 200, fill: "var(--color-safari)" },
//   { category: "firefox", tota: 287, fill: "var(--color-firefox)" },
//   { category: "edge", tota: 173, fill: "var(--color-edge)" },
//   { category: "other", tota: 190, fill: "var(--color-other)" },
// ];
// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// } satisfies ChartConfig;
const ExpensePieChart = ({
  pieChartData,
}: {
  pieChartData: PieChartData[] | undefined;
}) => {
  const totalVisitors = pieChartData?.reduce(
    (acc, curr) => acc + Number(curr.total),
    0
  );

  const chartData = pieChartData?.map((obj, i) => ({
    category: obj.category.split(" ")[0],
    total: Number(obj.total),
    fill: `var(--color-${obj.category.split(" ")[0]})`,
  }));
  return (
    <Card className="min-w-[300px] md:w-1/3">
      <CardHeader>
        <CardTitle>Pie chart</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className=" aspect-square ">
          <PieChart>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent nameKey="category" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey={"total"}
              nameKey={"category"}
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Rupess
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey="category"
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
