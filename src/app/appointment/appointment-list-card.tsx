import React from 'react';
import Image from 'next/image';

interface AppointmentListCardProps {
    patientName: string;
    patientAge: string;
    patientSex: string;
}

const AppointmentListCard: React.FC<AppointmentListCardProps> = ({ patientName, patientAge, patientSex }) => {
    return (
        <div className='main-list-box'>
            <div><Image src="/doctor.svg" alt="doctor" width={40} height={40} /></div>
            <div className='patient'>
                <p className='patient-name'>{patientName}</p>
                <span className='patient-age'>{patientAge}</span>
                <span className='patient-sex'>{patientSex}</span>
            </div>
            <div></div>
        </div>
    );
};

export default AppointmentListCard;