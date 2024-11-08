import React from 'react';
import {DataTableDemo} from '@/components/ui/history';

const DashboardPage: React.FC = () => {
    return (
        <div className='bg-gray-500/[.004] ... p-4'>
            <div className='text-md font-bold'>Appointment History</div>
            <div className='text-sm text-gray-500'>View your appointment history</div>
            <DataTableDemo/>
        </div>
    );
};

export default DashboardPage;