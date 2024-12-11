import React from 'react';
import { FaArrowUp } from "react-icons/fa";

const InfoCard = ({ text, icon, total, lastMonth}) => {
    return (
        <div className='border w-full py-4 flex flex-col justify-between'>
            <div className='flex items-center gap-4 justify-between mx-4'>
                <div>
                    <p className='font-semibold'>{text}</p>
                    <p>{total}</p>
                </div>
                <div className='text-3xl bg-blue-600 p-2 rounded-full text-white'>
                    {icon}
                </div>
            </div>
            <div className='flex items-center gap-4 ml-4'>
                <p className='flex items-center gap-1 text-green-400'>
                    <FaArrowUp className='text-green-400 text-sm' />
                    {lastMonth}
                </p>
                <p> Last Month</p>
            </div>
        </div>
    );
}

export default InfoCard;
