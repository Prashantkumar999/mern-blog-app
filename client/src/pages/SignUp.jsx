import React, { useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import {Link} from 'react-router-dom'


const SignUp = () => {

    const [showPassword, setShowPassword] = useState(true)
    return (
        <div className='w-11/12 mx-auto flex flex-col items-center justify-center gap-11'>
            <div className='font-semibold text-4xl'>SIGN UP</div>
            <div className='w-full flex flex-col items-center justify-center'>
                <form className='w-[50%] flex flex-col gap-5'>
                    <div className='flex gap-3 justify-between'>
                        <label htmlFor='username' className='font-semibold'>
                            Username <sup className='text-red-500 text-lg'>*</sup>
                        </label>
                        <input placeholder='Enter Your Username' id='username' type='text' name='username' required className='min-w-[80%] rounded-sm' />
                    </div>
                    <div className='flex gap-3 justify-between'>
                        <label htmlFor='email' className='font-semibold'>
                            Email <sup className='text-red-500 text-lg'>*</sup>
                        </label>
                        <input placeholder='Enter Your email' id='email' type='text' name='email' required className='min-w-[80%] rounded-sm' />
                    </div>
                    <div className='flex gap-3 justify-between relative'>
                        <label htmlFor='password' className='font-semibold'>
                            Password <sup className='text-red-500 text-lg'>*</sup>
                        </label>
                        <input placeholder='Enter Your Password' id='password' type={showPassword?"password":"text"} name='password' required className='min-w-[80%] rounded-sm' />
                        <div className=' absolute right-5 top-[25%] text-xl' onClick={()=>setShowPassword((prev)=>!prev)}>
                        {
                            showPassword ? (<FaEyeSlash />) : (<IoEyeSharp />)
                        }
                        </div>
                    </div>
                 <button type='submit' className='bg-yellow-300 py-4 font-semibold rounded-sm hover:bg-yellow-400 hover:scale-95 transition-all duration-200'>
                    Create Account
                 </button>
                </form>
                <div className='flex justify-start gap-2 w-[50%] mt-3 font-semibold'>
                    <p>Already have an account?</p>
                    <Link className='text-blue-500 hover:text-blue-600' to={"/signin"} >
                        Sign In
                    </Link>

                </div>
            </div>
            
        </div>
    );
}

export default SignUp;
