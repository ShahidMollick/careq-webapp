"use client"
import React from 'react';
import { DataTableDemo } from '@/components/ui/history';
import { ComboboxDemo } from "@/components/ui/combobox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MetricBox from '@/components/ui/metric-box';
import MetricBoxCustom from '@/components/ui/metric-box-custom';
import { Component } from '@/components/ui/graph-cards';

const DashboardPage: React.FC = () => {
    return (
        <div className='bg-gray-500/[.004] ...  rounded-md'>

            {/* Need To be copied in every page */}
            <div className="nav-bar  w-[100%] flex item-center justify-between p-3">
                <div className="font-bold text-[20px]">Dashboard</div>
                <div className="right flex items-center">
                    <div className="clinic-option">
                        <ComboboxDemo />
                        <Image src="/bell.svg" alt="bell" width={20} height={20} />
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


            <div className="current-consulting h-[50px] w-[100%] flex bg-[#e7f5f0] items-center gap-[22px] px-6 justify-between text-[12px] py-4">
                <div className='flex items-center gap-2'>
                    <Image src="/user.svg" alt="user" width={20} height={20} />
                    <div className='text-[#164772]'>
                        Your consultation queue is now live! Patient #3 is waiting
                    </div>
                </div>
                <div className='flex items-center'>
                    <Button variant="default">
                        Continue Consultation
                    </Button>
                    <img className='w-[30px]' src="/plus.svg" alt="" />
                </div>
            </div>

            <div className="numbercards flex mt-[20px] justify-around">
                <MetricBoxCustom number={65} heading='Total Appointments'></MetricBoxCustom>
                <MetricBoxCustom number={40} heading='Total Patient Waiting'></MetricBoxCustom>
                <MetricBoxCustom number={25} heading='Total Patients Consulted'></MetricBoxCustom>

                <div className="flex flex-row justify-between  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-3 w-[23%]  ml-[1.3rem]"
                    style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div>
                        <div>
                            <div className="font-bold text-[12px]">Total Revenue</div>
                            <div className="text-green-600 text-xs font-bold">Today</div>
                        </div>
                        <div className="text-sm text-gray-500">Set the dimensions for the layer.</div>
                    </div>
                    <div className="bg-primary-accent text-primary text-xl font-bold p-2 item-center h-max rounded-md">$3,200</div>
                </div>
            </div>

            <div className='ml-[20px] mt-[20px] font-bold text-[15px]'>Overview</div>
            <div className='flex mt-[10px]  justify-around'>
                <Component/>
                <Component/>
            </div>

        </div>
    );
};

export default DashboardPage;
