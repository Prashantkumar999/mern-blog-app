import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ article }) => {
  const stripHtml = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  const plainTextContent = stripHtml(article.content);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden group max-w-md w-full">
      <div className="relative">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 bg-green-200 text-green-800 dark:bg-green-700 dark:text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
          {article.category}
        </span>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-snug">
          {truncateText(article.title, 10)}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {truncateText(plainTextContent, 20)}
        </p>
        <Link to={`/post/${article.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
