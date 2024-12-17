import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                    About Me
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center">
                    Hi, I’m Prashant! I graduated from 
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {" "}Aligarh College of Engineering and Technology
                    </span> 
                    (affiliated with AKTU) with a 
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {" "}B.Tech in Computer Science
                    </span>. This blog is a project to showcase my skills in 
                    <span className="font-semibold text-gray-800 dark:text-gray-100"> MERN stack development</span>, 
                    combined with Firebase for efficient image storage solutions.
                </p>
                <p className="text-md text-gray-600 dark:text-gray-300 text-center">
                    I created this platform to share my journey as a developer, discuss technical insights, 
                    and contribute to the tech community. Feel free to explore, connect, and share your thoughts.
                </p>
                <div className="mt-6 flex flex-col items-center gap-4">
                    <a 
                        href="mailto:prashant047alg@gmail.com"
                        className="text-blue-500 hover:underline dark:text-blue-400 text-lg"
                    >
                        Email: prashant047alg@gmail.com
                    </a>
                  
                </div>
            </div>
        </div>
    );
}

export default About;
