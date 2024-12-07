import React, { useEffect, useState } from 'react';
import moment from 'moment'
import { FaCommentMedical, FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
const Comment = ({ comment, onLike }) => {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user)
    // console.log("users",user);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data)
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment])
    console.log(comment)
    return (

        <div className='my-2'>
            <div className='flex  items-center gap-2'>
                <img src={user.profilePicture} className='w-7 h-7 rounded-full' />
                <p className='italic font-semibold text-sm'>
                    {user ? (`@${user.username}`) : ("Deleted User")}
                </p>
                <p className='text-sm'>{moment(comment.createdAt).fromNow()}</p>
            </div>
            <div>
                <p className='text-sm'>{comment.content}</p>
                <div className='flex gap-3 items-center'>
                    <button
                        className={`text-gray-400 hover:text-gray-500 ${currentUser && comment.likes.includes(currentUser._id) ? '!text-blue-500' : ''}`}
                        type='button'
                        onClick={() => onLike(comment._id)}>
                        <FaThumbsUp className='text-sm' />
                    </button>

                    <p className='text-sm text-gray-400'>
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes
                            + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Comment;
