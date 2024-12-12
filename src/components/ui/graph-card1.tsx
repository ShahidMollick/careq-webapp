"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartData = [
  { month: "January", desktop: 300 },
  { month: "February", desktop: 420 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 330 },
  { month: "May", desktop: 380 },
  { month: "June", desktop: 480 },
  { month: "July", desktop: 400 },
  { month: "August", desktop: 436 },
  { month: "September", desktop: 440 },
  { month: "October", desktop: 320 },
  { month: "November", desktop: 270 },
  { month: "December", desktop: 490 },
];
const chartData2 = [
  { month: "January", desktop: 300 },
  { month: "February", desktop: 420 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 30 },
  { month: "May", desktop: 380 },
  { month: "June", desktop: 480 },
  { month: "July", desktop: 400 },
  { month: "August", desktop: 46 },
  { month: "September", desktop: 440 },
  { month: "October", desktop: 320 },
  { month: "November", desktop: 270 },
  { month: "December", desktop: 490 },
];

const chartData3 = [
    { month: "January", desktop: 300 },
    { month: "February", desktop: 420 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 30 },
    { month: "May", desktop: 380 },
    { month: "June", desktop: 40 },
    { month: "July", desktop: 400 },
    { month: "August", desktop: 46 },
    { month: "September", desktop: 440 },
    { month: "October", desktop: 320 },
    { month: "November", desktop: 270 },
    { month: "December", desktop: 490 },
    { month: "December", desktop: 490 },
    { month: "December", desktop: 490 },
    { month: "December", desktop: 490 },
    { month: "December", desktop: 490 },
  ];

const chartConfig = {
  desktop: {
    label: "Patients",
    color: " var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "#17C27B7A",
  },
} satisfies ChartConfig;

export function PatientGraph() {
  const [tabValue, setTabValue] = React.useState("daily"); // Track the active tab

  const getChartData = () => {
    switch (tabValue) {
      case "weekly":
        return chartData2; // Use weekly data
      case "annually":
        return chartData3; // Use annually data (or create a different dataset if needed)
      default:
        return chartData; // Default to daily data
    }
  };

  return (
    <Card className="w-full h-full">
      <Tabs value={tabValue} onValueChange={setTabValue} className="">
        <CardHeader>
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-[10px]">
              <div className="bg-[#164772] justify-center item-center rounded-md p-2 ">
                <svg
                  width="20"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="icon/user">
                    <path
                      id="Vector"
                      d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      id="Vector_2"
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <div>
                <CardTitle className="text-md">30,450</CardTitle>
                <CardDescription className="text-sm">
                  Patients Consulted
                </CardDescription>
              </div>
            </div>
            <div>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="annually">Annually</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer className="w-[100%] h-[100%] max-h-[300px]" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={getChartData()}
              margin={{
                left: -20,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={5} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="desktop"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.1}
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Tabs>
    </Card>
  );
}
