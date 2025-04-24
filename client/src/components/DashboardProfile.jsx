import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, TextInput, Modal } from 'flowbite-react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { PiSealWarningFill } from "react-icons/pi";
import { Link } from 'react-router-dom'

const DashboardProfile = () => {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    // console.log('Current User:', currentUser); for testing purpose

    const [currentImageFile, setCurrentImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [userUpdateStatus, setUserUpdateStatus] = useState(null);
    const [userUpdateError, setUserUpdateError] = useState(null);
    const [deleteAccountScreen, setDeleteAccountScreen] = useState(null)


    const filePicRef = useRef();
    const dispatch = useDispatch();
    const imageChangeHandler = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const fileSizeInMB = imageFile.size / (1024 * 1024); // Convert size to MB
            if (fileSizeInMB > 2) {
                setImageFileUploadError('The file size must be less than 2MB.');
                setCurrentImageFile(null); // clear all previous imagefile
                return;
            }
            setCurrentImageFile(imageFile);
            setImageFileUrl(URL.createObjectURL(imageFile));
            setImageFileUploadError(null); // clear previous errors
        }
    };

    useEffect(() => {
        if (currentImageFile) {
            uploadImage();
        }
    }, [currentImageFile]);

    const uploadImage = () => {
        setImageUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + currentImageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, currentImageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not upload image. Please try again.');
                console.log(error);
                setImageUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                });
                setImageUploading(false);
            }
        );
    };
    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            setUserUpdateError("No changes made");
            setUserUpdateStatus(false);
            return;
        }
        if (imageUploading) {
            setImageFileUploadError("Uploading Image please wait...")
            return;
        }
        try {
            dispatch(updateStart());
            const response = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                dispatch(updateFailure());
            }
            else {
                dispatch(updateSuccess(data));
                setUserUpdateStatus("User updated successfully")
                setUserUpdateError(null);

            }

        } catch (error) {
            dispatch(updateFailure(error.message));
            setImageFileUploadProgress(error.message)
        }

    }
    const handleDeleteUser = async () => {
        setDeleteAccountScreen(false);
        try {
            dispatch(deleteUserStart());
            const response = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (!response.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess())
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            const response = await fetch('/api/user/signout',
                {
                    method: "POST"
                });
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <form
                onSubmit={handleSubmitForm}
                className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6"
            >
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">User Profile</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={imageChangeHandler}
                        ref={filePicRef}
                        hidden
                    />
                    <div
                        onClick={() => filePicRef.current.click()}
                        className="relative cursor-pointer"
                    >
                        {imageFileUploadProgress && (
                            <CircularProgressbar
                                value={imageFileUploadProgress || 0}
                                text={`${imageFileUploadProgress}%`}
                                strokeWidth={5}
                                styles={{
                                    root: {
                                        width: '60px',
                                        height: '60px',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    },
                                    path: {
                                        stroke: '#60a5fa',
                                    },
                                }}
                            />
                        )}
                        <img
                            src={imageFileUrl || currentUser.profilePicture}
                            alt="Profile"
                            className="rounded-full w-[60px] h-[60px] object-cover border-2 border-blue-400"
                        />
                    </div>
                    {imageFileUploadError && (
                        <Alert color="failure" className="mt-4 w-full">
                            {imageFileUploadError}
                        </Alert>
                    )}
                </div>

                {/* Form Inputs */}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    onChange={onChangeHandler}
                    className="w-full"
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                    onChange={onChangeHandler}
                    className="w-full"
                />

                {/* Password Field with Toggle */}
                <div className="relative flex items-center">
                    <TextInput
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        onChange={onChangeHandler}
                        className="w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 text-gray-600 dark:text-gray-300"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Update Button */}
                <Button
                    type="submit"
                    color="success"
                    className="w-full"
                    disabled={loading || imageUploading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </Button>

                {/* Create Post (Admin only) */}
                {currentUser.isAdmin && (
                    <Link to="/create-post">
                        <Button color="blue" className="w-full">
                            + Create Post
                        </Button>
                    </Link>
                )}

                {/* Status Alerts */}
                {userUpdateStatus && <Alert color="success">{userUpdateStatus}</Alert>}
                {userUpdateError && <Alert color="failure">{userUpdateError}</Alert>}
            </form>

            {/* Footer Controls */}
            <div className="max-w-3xl mx-auto mt-6 text-sm text-red-600 dark:text-red-400 flex justify-between">
                <span
                    className="cursor-pointer hover:underline"
                    onClick={() => setDeleteAccountScreen(true)}
                >
                    Delete Account
                </span>
                <span
                    className="cursor-pointer hover:underline"
                    onClick={handleSignOut}
                >
                    Sign Out
                </span>
            </div>

            {/* Delete Modal */}
            <Modal show={deleteAccountScreen} onClose={() => setDeleteAccountScreen(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <PiSealWarningFill className="text-red-600 w-12 h-12" />
                        <p className="text-gray-800 dark:text-gray-100 font-medium">
                            Are you sure you want to delete your account?
                        </p>
                        <div className="flex gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Yes, I'm Sure
                            </Button>
                            <Button color="gray" onClick={() => setDeleteAccountScreen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashboardProfile;
