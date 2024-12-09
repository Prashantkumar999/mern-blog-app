import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Textarea, Button, Alert } from 'flowbite-react';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error("Error fetching comments:", error.message);
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (event) => {
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
                setComments([data, ...comments]);
                setComment('');
                setCommentError(null);
            } else {
                setCommentError(data.message || "Failed to add comment.");
            }
        } catch (error) {
            setCommentError("Something went wrong. Please try again.");
        }
    };

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, { method: 'PUT' });
            if (res.ok) {
                const data = await res.json();
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId ? { ...comment, ...data } : comment
                    )
                );
            }
        } catch (error) {
            console.error("Error liking comment:", error.message);
        }
    };

    const handleEdit = (commentToEdit, editedContent) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment._id === commentToEdit._id ? { ...comment, content: editedContent } : comment
            )
        );
    };

    const handleDelete = (commentId) => {
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    };

    return (
        <div>
            {currentUser ? (
                <>
                    <p>Signed in as @{currentUser.username}</p>
                    <form onSubmit={handleSubmit}>
                        <Textarea
                            placeholder="Add a comment"
                            rows="3"
                            maxLength="200"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                    {commentError && <Alert color="failure">{commentError}</Alert>}
                </>
            ) : (
                <p>
                    <Link to="/sign-in">Sign in</Link> to leave a comment.
                </p>
            )}
            <div>
                {comments.map((comment) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        onLike={handleLike}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
