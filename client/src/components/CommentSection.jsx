import { async } from '@firebase/util';
import { Alert, Button, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';
const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([]);
    // console.log(comments)
    const handleSubmitComment = async (event) => {
        event.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
            });
            const data = res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null);
            }

        } catch (error) {
            setCommentError(error.message);
        }
    }
    useEffect(() => {
        const getComments = async () => {
            const res = await fetch(`/api/comment/getPostComments/${postId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        }
        getComments()

    }, [postId])
    return (
        <div className='w-full'>
            {
                currentUser ? (
                    <div className='flex items-center'>
                        <p className='mr-2 font-semibold'>Signed in as:</p>
                        <img className='h-5 w-5 rounded-full' src={currentUser.profilePicture} alt='user profile picture' />
                        <Link className='italic font-semibold text-blue-600' to={'/dashboard?tab=profile'}>@{currentUser.username}</Link>
                    </div>
                ) : (<div>
                    You must be signed in to comment.
                    <Link to={'/sign-in'}>
                        Sign In
                    </Link>
                </div>)
            }
            {
                currentUser && (
                    <form className='border' onSubmit={handleSubmitComment}>
                        <Textarea
                            placeholder='Add a comment'
                            rows='3'
                            maxLength='200'
                            onChange={(event) => setComment(event.target.value)}
                        />
                        <div className='flex justify-between px-4 mt-2'>
                            <p>{200 - comment.length} chars remaining</p>
                            <Button outline type='submit'>Submit</Button>
                        </div>
                        {
                            commentError && (<Alert color='failure'>
                                {commentError}
                            </Alert>)
                        }


                    </form>
                )
            }
            {

                comments.length === 0 ?
                    (<p>No Comments Yet</p>) :
                    (
                        <>
                        <div className='flex items-center gap-1 '>
                            <p>Comments</p>
                            <div className='border-1 border-red-400'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {
                            comments.map(comment=>(
                                <Comment 
                                key={comment._id}
                                comment={comment}
                                />
                            ))
                        }
                       
                        </>
                    )
            }

        </div>
    );
}

export default CommentSection;
