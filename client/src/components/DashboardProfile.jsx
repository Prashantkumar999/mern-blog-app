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

const DashboardProfile = () => {
    const { currentUser, error } = useSelector((state) => state.user);
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
        <div className="w-full">
            <form onSubmit={handleSubmitForm} className="w-full flex flex-col gap-3 lg:px-10">
                <div className="flex flex-col items-center">
                    {currentUser?.profilePicture ? (
                        <>
                            <p className="text-3xl font-semibold text-slate-500">User Profile</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={imageChangeHandler}
                                ref={filePicRef}
                                hidden
                            />
                            <div onClick={() => filePicRef.current.click()} className='relative'>
                                {imageFileUploadProgress && (<CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}`}
                                    strokeWidth={5}
                                    styles={{
                                        root: {
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        },
                                        path: {
                                            stroke: "lightblue"
                                        }
                                    }}
                                />)}
                                <img
                                    src={imageFileUrl || currentUser.profilePicture}
                                    alt="Profile"
                                    className="bg-red-400 rounded-full w-[60px] h-[60px] self-center"
                                />
                            </div>
                            {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                        </>
                    ) : (
                        <p>No profile picture available</p>
                    )}
                </div>
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    onChange={onChangeHandler}
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                    onChange={onChangeHandler}
                />

                <div className="relative w-full flex">
                    <TextInput
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Password"
                        onChange={onChangeHandler}
                        className="w-[80%] pr-10" // Full width and padding for the icon

                    />
                    <button
                        className={`flex items-center gap-2 font-semibold w-[20%] text-white just justify-center ${showPassword ? "bg-green-400" : "bg-red-400"} rounded-md hover:scale-95 transition-all duration-200`}
                        onClick={() => setShowPassword((prev) => !prev)} // Correctly toggling state
                        type="button" // Prevent form submission when clicking the button
                    >
                        {showPassword ? "Hide Password" : "Show Password"}
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                </div>

                <Button type="submit" color="green" className="self-center">
                    Update Profile
                </Button>
            </form>
            <div className='px-10'>

                <div className="flex text-red-600 font-semibold mx-10 justify-between">
                    <span onClick={() => setDeleteAccountScreen(true)} className="cursor-pointer">Delete Account</span>
                    <span onClick={handleSignOut}
                        className="cursor-pointer">Sign Out</span>
                </div>
                {
                    userUpdateStatus && <Alert color='success'>
                        {userUpdateStatus}
                    </Alert>
                }
                {
                    userUpdateError && <Alert color='failure'>
                        {userUpdateError}
                    </Alert>
                }
                <Modal show={deleteAccountScreen} onClose={() => setDeleteAccountScreen(false)} popup size='md'>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='flex justify-center flex-col items-center gap-4'>
                            <PiSealWarningFill className='w-12 h-12' />
                            <p>Do You Really Want To Delete Your Account?</p>
                            <div className='flex justify-between gap-4'>
                                <Button color='failure' onClick={handleDeleteUser}>
                                    Yes I'm Sure
                                </Button>
                                <Button color='gray' onClick={() => setDeleteAccountScreen(false)}>
                                    No, Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default DashboardProfile;
