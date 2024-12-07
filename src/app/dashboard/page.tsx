import React from 'react';
import { DataTableDemo } from '@/components/ui/history';
import { ComboboxDemo } from "@/components/ui/combobox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MetricBox from '@/components/ui/metric-box';

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
                <Button className="text-xl p-5 bg-green-600">
                    Continue Consultation
                </Button>
            </div>

            <div className="numbercards flex">

                <div className="flex flex-row justify-between rounded-md  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-5 w-[316px] h-[130px] ml-[1.3rem]"
                    style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div>
                        <div>
                            <div>Total Appointments</div>
                            <div>Today</div>
                        </div>
                        <div className="text-sm text-gray-500">Total Appointments Your Patients Have Booked For Today</div>
                    </div>
                    <div className="bg-primary-accent text-primary text-3xl bold item-center  rounded-md h-[82px]">65</div>
                </div>


                <div className="flex flex-row justify-between rounded-md  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-5 w-[316px] h-[130px] ml-[1.3rem]"
                    style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div>
                        <div>
                            <div>Total Appointments</div>
                            <div>Today</div>
                        </div>
                        <div className="text-sm text-gray-500">Total Patients Waiting for Your Consultation Today</div>
                    </div>
                    <div className="bg-primary-accent text-primary text-3xl bold  item-center rounded-md">40</div>
                </div>


                <div className="flex flex-row justify-between rounded-md  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-5 w-[316px] h-[130px] ml-[1.3rem]"
                    style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div>
                        <div>
                            <div>Total Appointments</div>
                            <div>Today</div>
                        </div>
                        <div className="text-sm text-gray-500">Total Patients You&apos;ve Consulted Today</div>
                    </div>
                    <div className="bg-primary-accent text-primary text-3xl bold  item-center rounded-md">25</div>
                </div>


                <div className="flex flex-row justify-between rounded-md  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-5 w-[316px] h-[130px] ml-[1.3rem]"
                    style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div>
                        <div>
                            <div>Total Appointments</div>
                            <div>Today</div>
                        </div>
                        <div className="text-sm text-gray-500">Total Revenue You’ve Earned Today</div>
                    </div>
                    <div className="bg-primary-accent text-primary text-3xl bold item-center rounded-md">$3,200</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
