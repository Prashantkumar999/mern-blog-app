import React from 'react';

const HomePageHeroSec = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-4 md:px-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
          Welcome to <span className="text-blue-600 dark:text-blue-400">techShot Blog</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300">
          Share your thoughts, explore new ideas, and connect with readers — all in one place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/blogs"
            className="border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 px-6 py-3 rounded-2xl font-semibold transition duration-300"
          >
            Explore Blogs
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePageHeroSec;
