import React from 'react';
import {Link} from 'react-router-dom'

const PostCard = ({ article }) => {
    // Helper function to truncate text by a given number of words
    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    return (
        <div className="max-w-sm group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
           <div className='bg-green-300 absolute right-0 top-1 text-sm sm:text-md z-10 px-3 rounded-l-lg font-semibold py-2'>
           <p className=' text-black'>{article.category}</p>
           </div>
            <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-200"
            />
            <div className="p-4">
                <h2 className="text-lg font-bold mb-2 text-gray-800">
                    {truncateText(article.title, 10)} {/* Limit to 10 words */}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {truncateText(article.content, 20)} {/* Limit to 20 words */}
                </p>
                <Link to={`/post/${article.slug}`}>
                <button className="text-blue-500 hover:underline">
                    Read More
                </button>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
