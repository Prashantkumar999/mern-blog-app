import { Button } from 'flowbite-react';
import React from 'react';

const CallToAction = () => {
    return (
        <div className='flex flex-col sm:flex-row w-full gap-5 '>
            <div className='flex flex-col flex-1 '>
                <h2 className='text-xl font-bold py-1'>Want to Learn More About javaScript?</h2>
                <p>
                    Checkout these resources with 100 javascript projects
                </p>
                <Button className='w-40 self-center mt-2'>
                    <a>Learn More</a>
                </Button>
            </div>
            <div className='flex-1 w-full mb-2'>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZq_FDxj8jleGCeDXaWUdeuD1XGtvc2wG0Vg&s' alt='javaScript image' className=' object-cover'/>
            </div>
        </div>
    );
}

export default CallToAction;
