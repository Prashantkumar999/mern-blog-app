import React, { useEffect, useState } from 'react';
import moment from 'moment'
import { FaCommentMedical } from 'react-icons/fa';
const Comment = ({ comment }) => {
    const [user, setUser] = useState({});
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
            <div className='text-sm'>
                {comment.content}
            </div>
        </div>
    );
}

export default Comment;
