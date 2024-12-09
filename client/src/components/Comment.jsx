import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea, Modal } from 'flowbite-react';
import { PiSealWarningFill } from 'react-icons/pi';

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);
    const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching user:", error.message);
            }
        };
        getUser();
    }, [comment]);

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedComment }),
            });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedComment);
            }
        } catch (error) {
            console.error("Error editing comment:", error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${comment._id}`, { method: 'DELETE' });
            if (res.ok) {
                setShowConfirmationScreen(false);
                onDelete(comment._id);
            } else {
                console.error("Error deleting comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error.message);
        }
    };

    return (
        <div className="my-2">
            <div className="flex items-center gap-2">
                <img src={user.profilePicture} alt="User Avatar" className="w-7 h-7 rounded-full" />
                <p className="italic font-semibold text-sm">
                    {currentUser ? `@${user.username}` : 'Deleted User'}
                </p>
                <p className="text-sm">{moment(comment.createdAt).fromNow()}</p>
            </div>
            {isEditing ? (
                <div>
                    <Textarea
                        placeholder="Edit your comment"
                        rows="3"
                        maxLength="200"
                        value={editedComment}
                        onChange={(event) => setEditedComment(event.target.value)}
                    />
                    <div className="flex gap-2 justify-end my-2">
                        <Button onClick={handleSave} color="green">
                            Save
                        </Button>
                        <Button color="red" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex gap-3 items-center">
                        <button
                            className={`text-gray-400 hover:text-gray-500 ${
                                currentUser && comment.likes.includes(currentUser._id) ? '!text-blue-500' : ''
                            }`}
                            onClick={() => onLike(comment._id)}
                        >
                            <FaThumbsUp className="text-sm" />
                        </button>
                        <p className="text-sm text-gray-400">
                            {comment.numberOfLikes > 0 &&
                                `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? 'like' : 'likes'}`}
                        </p>
                        {currentUser &&
                            (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setIsEditing(true)}>
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => setShowConfirmationScreen(true)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                    </div>
                </>
            )}

            <Modal show={showConfirmationScreen} onClose={() => setShowConfirmationScreen(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="flex flex-col items-center gap-4">
                        <PiSealWarningFill className="w-12 h-12" />
                        <p>Do you really want to delete this comment?</p>
                        <div className="flex gap-4">
                            <Button color="failure" onClick={handleDelete}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowConfirmationScreen(false)}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Comment;
