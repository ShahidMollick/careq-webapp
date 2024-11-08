import AppointmentBox from '@/components/ui/appointment-box';
import PrescriptionStatusBox from '@/components/ui/prescription-status-box';
import React from 'react';

const ReceptionistPage: React.FC = () => {
   
    return (
        <div className='grid grid-cols-3 gap-4 p-4'>
            <AppointmentBox />
            <PrescriptionStatusBox />
        </div>
    );
};

export default ReceptionistPage;