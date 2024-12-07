"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
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
]
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#17C27B7A",
    },
    mobile: {
        label: "Mobile",
        color: "#17C27B7A",
    },
} satisfies ChartConfig

export function Component() {
    return (
        <Card className=" h-[370px]">
            {/* <CardHeader>
                <CardTitle>Area Chart - Axes</CardTitle>
                <CardDescription>
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader> */}
            <div className="flex justify-around">
                <div className=" ">

                    <div className="flex">
                        <div className="bg-[#164772] rounded-sm px-[8px] py-[9px]">
                            <svg width="20" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="icon/user">
                                    <path id="Vector" d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path id="Vector_2" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                            </svg>
                        </div>
                        <div className="text-3xl">30,450</div>
                    </div>
                    <div className="text-xs">
                        Patients Consulted
                    </div>

                </div>
                <div className="flex bg-blue-100 items-center rounded-md">
                    <div className="p-[2px] text-[#9291A5]">Daily</div>
                    <div className="p-[2px] text-[#9291A5]">Weekly</div>
                    <div className="p-[2px] text-white px-[10px] py-[5px] bg-blue-950">Annually</div>
                </div>
            </div>
            <CardContent className="">
                <ChartContainer className="h-[300px]" config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
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
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
