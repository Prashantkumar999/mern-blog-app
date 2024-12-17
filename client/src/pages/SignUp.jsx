import React, { useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // For displaying errors
  const navigate = useNavigate();

  // Handle form input changes
  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const data = await response.json();
      console.log('User registered:', data);

      // Redirect to sign-in page on successful signup
      navigate('/signin');
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage(error.message); // Set error message to display it in the UI
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-start sm:items-center dark:text-white'>

    <div className='w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 p-6 bg-white dark:bg-gray-900 shadow-md rounded-md'>
      <h1 className='font-bold text-3xl'>Create Account</h1>

      <form className='w-full flex flex-col gap-6' onSubmit={onSubmitHandler}>
        {/* Username Field */}
        <div className='flex flex-col'>
          <label htmlFor='username' className='font-semibold'>
            Username <sup className='text-red-500'>*</sup>
          </label>
          <input
            placeholder='Enter your username'
            id='username'
            type='text'
            name='username'
            value={formData.username}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            onChange={onChangeHandler}
          />
        </div>

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
          Sign Up
        </button>
      </form>

      {/* Display Error Message */}
      {errorMessage && (
        <div className='text-red-500 font-semibold mt-3'>
          {errorMessage}
        </div>
      )}

      {/* Link to Sign In */}
      <div className='mt-4'>
        <p className='text-sm'>
          Already have an account?{' '}
          <Link to='/signin' className='text-blue-500 hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
