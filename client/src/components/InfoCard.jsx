import React from 'react';
import { FaArrowUp } from "react-icons/fa";

const InfoCard = ({ text, icon, total, lastMonth }) => {
    return (
        <div className='w-full rounded-xl shadow-md bg-white dark:bg-gray-800 p-5 flex flex-col justify-between gap-4 transition-all'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>{text}</p>
                    <h3 className='text-xl font-semibold text-gray-800 dark:text-white'>{total}</h3>
                </div>
                <div className='text-2xl bg-blue-600 p-3 rounded-full text-white'>
                    {icon}
                </div>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300'>
                <span className='flex items-center text-green-500 font-medium'>
                    <FaArrowUp className='text-xs mr-1' />
                    {lastMonth}
                </span>
                <span>since last month</span>
            </div>
        </div>
    );
};

export default InfoCard;
