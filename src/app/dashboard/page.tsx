"use client"
import React from 'react';
import { DataTableDemo } from '@/components/ui/history';
import { ComboboxDemo } from "@/components/ui/combobox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MetricBox from '@/components/ui/metric-box';
import MetricBoxCustom from '@/components/ui/metric-box-custom';
import { Component } from '@/components/ui/graph-cards';

// import { TrendingUp } from "lucide-react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// import { Component } from '@/components/ui/graph-cards';
// const chartData = [
//     { month: "January", desktop: 186 },
//     { month: "February", desktop: 305 },
//     { month: "March", desktop: 237 },
//     { month: "April", desktop: 73 },
//     { month: "May", desktop: 209 },
//     { month: "June", desktop: 214 },
// ]

// const chartConfig = {
//     desktop: {
//         label: "Desktop",
//         color: "hsl(var(--chart-1))",
//     },
// } satisfies ChartConfig

const DashboardPage: React.FC = () => {
    return (
        <div className='bg-gray-500/[.004] ...  rounded-md'>
            {/* <div className='text-md font-bold'>Dashboard</div> */}

            {/* Need To be copied in every page */}

            <div className="nav-bar item-center">
                <div className="text-xl font-bold">Dashboard</div>
                <div className="right">
                    <div className="clinic-option">
                        <ComboboxDemo />
                        <Image src="/bell.svg" alt="bell" width={30} height={30} />
                    </div>
                    <div className="doctor-profile">
                        <Image src="/doctor.svg" alt="doctor" width={40} height={40} />
                        <div className="doctor-name">
                            <p className='font-bold'>Dr. John Doe</p>
                            <p>Doctor</p>
                        </div>
                        <Image src="/chevron-down.svg" alt="down-arrow" width={20} height={20} />
                    </div>
                </div>
            </div>

            {/* <DataTableDemo/> */}

            <div className="current-consulting h-[80px] w-[100%] flex bg-[#e7f5f0] items-center gap-[22px] px-6 justify-between">
                <div className='flex'>
                    <Image src="/user.svg" alt="user" width={30} height={30} />
                    <div className='text-[#164772]'>
                        Your consultation queue is now live! Patient #3 is waiting
                    </div>
                </div>
                <Button className="p-5 bg-green-600 text-[15px]">
                    Continue Consultation
                </Button>
            </div>

            <div className="numbercards flex mt-[20px]">
                <MetricBoxCustom number={65} heading='Total Appointments'></MetricBoxCustom>

                <MetricBoxCustom number={40} heading='Total Patient Waiting'></MetricBoxCustom>

                <MetricBoxCustom number={25} heading='Total Patients Consulted'></MetricBoxCustom>

                <div className="flex flex-row justify-between  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-3 w-[23%]  h-[120px] ml-[1.3rem]"
                    style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div>
                        <div>
                            <div className="font-bold">Total Revenue</div>
                            <div className="text-green-600 font-bold">Today</div>
                        </div>
                        <div className="text-sm text-gray-500">Set the dimensions for the layer.</div>
                    </div>
                    <div className="bg-primary-accent text-primary text-3xl font-bold p-2 item-center h-[50px] rounded-md">$3,200</div>
                </div>
            </div>

                    <div className='ml-[20px] font-bold text-[20px]'>Overview</div>
            <div className='flex mt-[10px]  justify-around'>
                <Component />
                <Component />
            </div>

        </div>
    );
};

export default DashboardPage;
