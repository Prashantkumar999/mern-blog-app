import React, { useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import {signInSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Optional: to display error messages
  const navigate = useNavigate();
const dispatch = useDispatch();
  // Handle form input changes
  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Handle non-2xx status codes
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign in');
      }

      const data = await response.json();
      console.log('User signed in:', data);

      dispatch(signInSuccess(data))

      // If login is successful, navigate to the home page
      navigate('/');
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage(error.message); // Set error message to display in UI
    }
  };

  return (
    <div className='w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 p-6 bg-white shadow-md rounded-md'>
      <h1 className='font-bold text-3xl'>Sign In</h1>

      <form className='w-full flex flex-col gap-6' onSubmit={onSubmitHandler}>
        {/* Email Field */}
        <div className='flex flex-col'>
          <label htmlFor='email' className='font-semibold'>
            Email <sup className='text-red-500'>*</sup>
          </label>
          <input
            placeholder='Enter your email'
            id='email'
            type='email'
            name='email'
            value={formData.email}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            onChange={onChangeHandler}
          />
        </div>

        {/* Password Field */}
        <div className='flex flex-col relative'>
          <label htmlFor='password' className='font-semibold'>
            Password <sup className='text-red-500'>*</sup>
          </label>
          <input
            placeholder='Enter your password'
            id='password'
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            onChange={onChangeHandler}
          />
          <div className='absolute right-3 top-10 cursor-pointer text-lg' onClick={() => setShowPassword(prev => !prev)}>
            {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200'
        >
          Sign In
        </button>
      </form>

      {/* Display Error Message */}
      {errorMessage && (
        <div className='text-red-500 font-semibold mt-3'>
          {errorMessage}
        </div>
      )}

      {/* Link to Sign Up */}
      <div className='mt-4'>
        <p className='text-sm'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-blue-500 hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
