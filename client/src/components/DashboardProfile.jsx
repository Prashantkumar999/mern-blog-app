import React from 'react';
import { useSelector } from 'react-redux';
import {Button, TextInput} from 'flowbite-react'

const DashboardProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    console.log("Current User:", currentUser);

    return (
        <div className='w-full'>
            <form className='w-full flex flex-col gap-3'>
                <div className='flex flex-col items-center'>
                    {currentUser?.profilePicture ? (
                        <>
                        <p className='text-3xl font-semibold text-slate-500'>User Profile</p>
                            <img
                                src={currentUser.profilePicture}
                                alt="Profile"
                                className='bg-red-400 rounded-full w-[60px] h-[60px] self-center'
                            />
                        </>
                     ) : (
                        <p>No profile picture available</p>
                    )}
                </div>
                <TextInput 
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}
                />
                    <TextInput 
                    type="text"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                />    <TextInput 
                    type="text"
                    id="password"
                    placeholder="password"
                />
                <Button type='submit' color='green' className=' self-center '>
                    Update Profile
                </Button>
            </form>
            <div className='flex text-red-600 font-semibold mx-10 justify-between'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Delete Account</span>
            </div>
        </div>
    );
};

export default DashboardProfile;
