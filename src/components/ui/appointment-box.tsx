import React from 'react';
import {Button} from './button';
import Image from 'next/image';

const AppointmentBox: React.FC = () => {
    return (
        <div className='flex flex-col gap-4 width-full max-w-lg'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-col'>
                    <div className='text-md font-bold'>Prescription Status</div>
                    <div className='text-sm text-gray-500'>Check the status of prescription</div>
                </div>
                <Button className=' md text-black border border-solid rounded-lg bg-white border-slate-500/[0.37] ...'>View Complete List</Button>
            </div>
            <div className='flex flex-row gap-4 border-b pb-4 border-slate-500/[0.37] ...'>
                <Button  className='sm rounded-full bg-white border-solid border-slate-500/[0.37] ... text-black '>All</Button>
                <Button  className='sm rounded-full bg-white border-solid border-slate-500/[0.37] ... text-black '>Pending</Button>
                <Button  className='sm rounded-full bg-white border-solid border-slate-500/[0.37] ... text-black '>Uploaded</Button>
            </div>
            <div className='flex flex-col justify-between width-full'>
                <div className='flex flex-row gap-4 items-center justify-between width-full py-2'>
                    <Image src="./doctor.svg" alt="doctor icon" width={50} height={50} />
                    <div className='flex flex-col'>
                        <div className='text-md font-bold text-slate-900'>Sharan Das Gupta Sharma</div>
                        <div className='text-sm text-gray-500'>Sex: Female Age: 21</div>
                    </div>
                    <Button size='sm' className=' '><Image src="./uploadIcon.svg" alt="upload icon" width={16} height={16} />Upload prescription</Button>
                </div>
                <div className='flex flex-row gap-4 items-center justify-between width-ful py-2l'>
                    <Image src="./doctor.svg" alt="doctor icon" width={50} height={50} />
                    <div className='flex flex-col'>
                        <div className='text-md font-bold text-slate-900'>Sharan Das Gupta Sharma</div>
                        <div className='text-sm text-gray-500'>Sex: Female  Age: 21</div>
                    </div>
                    <Button size='sm' className=' '><Image src="./uploadIcon.svg" alt="upload icon" width={16} height={16} />Upload prescription</Button>
                </div>
                <div className='flex flex-row gap-4 items-center justify-between width-full py-2'>
                    <Image src="./doctor.svg" alt="doctor icon" width={50} height={50} />   
                    <div className='flex flex-col'>
                        <div className='text-md font-bold text-slate-900'>Sharan Das Gupta Sharma</div>
                        <div className='text-sm text-gray-500'>Sex: Female  Age: 21</div>
                    </div>
                    <Button size='sm' className=''>
                        <Image src="./uploadIcon.svg" alt="upload icon" width={16} height={16} />
                        Upload prescription
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBox;