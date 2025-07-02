"use client";
import React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
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
    color: "hsl(var(--chart-6))",
  },
  Financial: {
    label: "Financial expenses",
    color: "hsl(var(--chart-7))",
  },
  Communication: {
    label: "Communication, PC",
    color: "hsl(var(--chart-8))",
  },
  Investments: {
    label: "Investments",
    color: "hsl(var(--chart-9))",
  },
  Income: {
    label: "Income",
    color: "hsl(var(--chart-10))",
  },
  miscellaneous: {
    label: "Miscellaneous",
    color: "hsl(var(--chart-11))",
  },
} satisfies ChartConfig;
 
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
