import { Button } from 'flowbite-react';
import React from 'react';

const CallToAction = () => {
    return (
        <div className='flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 sm:p-10 mt-6'>
            <div className='flex-1 text-center lg:text-left'>
                <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3'>
                    Want to Learn More About JavaScript?
                </h2>
                <p className='text-gray-600 text-base sm:text-lg mb-4'>
                    Check out these curated resources with 100 JavaScript projects to level up your skills.
                </p>
                <Button className='w-44 hover:scale-95 transition-transform duration-200'>
                    <a href='#' target='_blank' rel='noopener noreferrer'>
                        Learn More
                    </a>
                </Button>
            </div>

            <div className='flex-1 w-full max-w-md'>
                <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZq_FDxj8jleGCeDXaWUdeuD1XGtvc2wG0Vg&s'
                    alt='JavaScript visual'
                    className='w-full h-auto rounded-xl object-cover shadow-lg'
                />
            </div>
        </div>
    );
};

export default CallToAction;
