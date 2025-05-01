import React from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='bg-gray-800 text-white py-5 mt-3'>
            <div className='text-center'>
                <p>© 2024 TechShot. All rights reserved.</p>
                <p>Created By Prashant</p>
            </div>
            <div className='flex justify-center gap-6 mt-4'>
                {/* GitHub Link */}
                <a
                    href="https://github.com/Prashantkumar999" // Replace with your GitHub profile link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <FaGithub size={24} />
                </a>

                {/* LinkedIn Link */}
                <a
                    href="https://linkedin.com/in/your-username" // Replace with your LinkedIn profile link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <FaLinkedin size={24} />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
