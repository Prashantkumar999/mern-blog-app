import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaBlogger } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className='bg-gray-800 text-white py-10'>
            <div className='flex justify-between mx-10'>
                <div>
                    <p className='text-3xl'>logo</p>
                </div>
                <div className='flex gap-3 text-md font-semibold border-x-4 px-40'>
                    <Link to={"/"}>Home </Link>
                    <Link to={"/aboutus"}>About Us </Link>
                    <Link to={"/signup"}>Sign Up </Link>
                    <Link to={"/signin"}>Sign In</Link>

                </div>
                <div className='flex flex-col justify-start items-center gap-3'>
                    <div>
                        <p className='font-semibold'>Follow Us </p>
                    </div>
                    <div className='flex gap-2 text-2xl'>
                        <FaInstagram className='hover:text-red-600' />
                        <FaInstagram className='hover:text-red-600'/>
                        <FaInstagram className='hover:text-red-600'/>
                        <FaInstagram className='hover:text-red-600'/>
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                copyright section
            </div>
        </footer>
    );
}

export default Footer;
