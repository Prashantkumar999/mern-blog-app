import React, { useEffect, useState } from 'react';
import moment from 'moment'
import { FaCommentMedical, FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

const Comment = ({ comment, onLike,onEdit }) => {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content)
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
    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editedComment,
                }),
            });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedComment); // Pass the updated content to the parent component
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    // console.log(comment)
    const handleEditComment = async () => {
        setIsEditing(true);
        setEditedComment(comment.content)
    }
    return (

        <div className='my-2'>
            <div className='flex  items-center gap-2'>
                <img src={user.profilePicture} className='w-7 h-7 rounded-full' />
                <p className='italic font-semibold text-sm'>
                    {currentUser ? (`@${user.username}`) : ("Deleted User")}
                </p>
                <p className='text-sm'>{moment(comment.createdAt).fromNow()}</p>
            </div>
            {
                isEditing ?
                    (< div>

                        <Textarea
                            placeholder="Add a comment"
                            rows="3"
                            maxLength="200"
                            value={editedComment}
                            onChange={(event) => setEditedComment(event.target.value)}
                        />
                        <div className='flex gap-2 justify-end mr-4 my-2'>
                            <Button onClick={handleSave}  color='green'>Save</Button>
                            <Button color='red' onClick={()=>setIsEditing(false)}>Cancel</Button>
                        </div>
                    </div>
                    ) :
                    (
                        <>
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
                                    {
                                        currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                            <button type='button' onClick={handleEditComment}>
                                                Edit
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </>
                    )
            }

        </div>
    );
}

export default Comment;
