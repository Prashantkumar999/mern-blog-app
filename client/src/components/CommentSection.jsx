import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { editComment } from '../../../api/controllers/comment.controller';
import { FaCommentMedical } from 'react-icons/fa';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        if (comment.length > 200) {
            setCommentError("Comment exceeds the maximum length of 200 characters.");
            return;
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prevComments) => [data, ...prevComments]); // Add new comment to the top
                setComment('');
                setCommentError(null);
            } else {
                setCommentError(data.message || "Failed to post comment.");
            }
        } catch (error) {
            setCommentError("Something went wrong. Please try again later.");
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.log("Failed to fetch comments:", error.message);
            }
        };
        getComments();
    }, [postId]);

    const handleEdit = (editedComment, editedContent) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment._id === editedComment._id
                    ? { ...comment, content: editedContent }
                    : comment
            )
        );
    };
    

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const response = await fetch(`/api/comment/likeComment/${commentId}`, { method: 'PUT' });
            if (response.ok) {
                const data = await response.json();
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId
                            ? {
                                  ...comment,
                                  likes: data.likes,
                                  numberOfLikes: data.likes.length,
                              }
                            : comment
                    )
                );
            }
        } catch (error) {
            console.log("Failed to like comment:", error.message);
        }
    };

    return (
        <div className="w-full">
            {currentUser ? (
                <div className="flex items-center">
                    <p className="mr-2 font-semibold">Signed in as:</p>
                    <img className="h-5 w-5 rounded-full" src={currentUser.profilePicture} alt="User profile" />
                    <Link className="italic font-semibold text-blue-600" to="/dashboard?tab=profile">
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div>
                    You must be signed in to comment.{' '}
                    <Link to="/sign-in" className="text-blue-600">
                        Sign In
                    </Link>
                </div>
            )}

            {currentUser && (
                <form className="border mt-4" onSubmit={handleSubmitComment}>
                    <Textarea
                        placeholder="Add a comment"
                        rows="3"
                        maxLength="200"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />
                    <div className="flex justify-between px-4 mt-2">
                        <p>{200 - comment.length} chars remaining</p>
                        <Button outline type="submit">
                            Submit
                        </Button>
                    </div>
                    {commentError && <Alert color="failure">{commentError}</Alert>}
                </form>
            )}

            {comments.length === 0 ? (
                <p>No Comments Yet</p>
            ) : (
                <>
                    <div className="flex items-center gap-1 mt-4">
                        <p>Comments</p>
                        <div className="border-1 border-red-400 px-2">
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit ={handleEdit}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;
