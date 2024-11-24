import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';

const DashboardProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    // console.log('Current User:', currentUser); for testing purpose

    const [currentImageFile, setCurrentImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const filePicRef = useRef();

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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                });
            }
        );
    };
console.log("progress",imageFileUploadProgress);
    return (
        <div className="w-full">
            <form className="w-full flex flex-col gap-3">
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
                            <div onClick={() => filePicRef.current.click()}className='relative'>
                            {imageFileUploadProgress && (<CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}`}
                            strokeWidth={5}
                            styles={{
                                root:{
                                    width:'100%',
                                    height:'100%',
                                    position:'absolute',
                                    top:0,
                                    left:0
                                },
                                path:{
                                    stroke:"lightblue"
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
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                />
                <TextInput
                    type="text"
                    id="password"
                    placeholder="Password"
                />
                <Button type="submit" color="green" className="self-center">
                    Update Profile
                </Button>
            </form>

            <div className="flex text-red-600 font-semibold mx-10 justify-between">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Delete Account</span>
            </div>
        </div>
    );
};

export default DashboardProfile;
