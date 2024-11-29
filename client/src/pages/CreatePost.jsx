import React, { useState } from 'react';
import { Select, TextInput, FileInput, Button, Alert } from 'flowbite-react'
import ReactQuill from 'react-quill';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import {useNavigate} from 'react-router-dom';
import { app } from '../firebase'
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const CreatePost = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUplaodError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishPostError, setPublishPostError] = useState(null);

    const navigate = useNavigate();
    const handleFileSubmit = async () => {
        try {
            if (!imageFile) {
                setImageUplaodError("Please select an image to upload");
                return;
            }
            setImageUplaodError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + imageFile.name; // Use imageFile.name
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile); // Pass imageFile

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUplaodError("Image upload failed");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUplaodError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUplaodError("Image Upload Failed");
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log("Response data:", data); // Log to confirm the structure
    
            if (!response.ok) {
                setPublishPostError(data.message || "An error occurred");
                return;
            }
    
            // Access the slug from data.savedPost.slug
            const slug = data.savedPost.slug;
            if (!slug) {
                setPublishPostError("Slug not found in response");
                return;
            }
    
            setPublishPostError(null);
            navigate(`/post/${slug}`); // Navigate using the slug
        } catch (error) {
            setPublishPostError("Something went wrong!");
            console.error(error);
        }
    };
    return (
        <div>
            <form className='flex flex-col w-[50%] mx-auto  m-3 p-3 gap-3' onSubmit={handleFormSubmit}>
                <div className='flex flex-col sm:flex-row gap-3'>
                    <TextInput type='text' required id='title' placeholder='title' className='flex-1' onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        defaultValue="uncategorized">
                        <option value="uncategorized" disabled hidden>
                            Select a category
                        </option>
                        <option value="javascript">javascript</option>
                        <option value="reactjs">reactjs</option>
                        <option value="nextjs">nextjs</option>
                    </Select>
                </div>
                <div className='flex justify-between gap-3'>
                    <FileInput type='file' accept='image/*' className='flex-1' onChange={(e) => setImageFile(e.target.files[0])} />
                    <Button onClick={handleFileSubmit} disabled={imageUploadProgress}>
                        {
                            imageUploadProgress ? (
                                <div className='w-16 h-16'>
                                    <CircularProgressbar value={imageUploadProgress}
                                        text={`${imageUploadProgress || 0}%`}
                                    />
                                </div>
                            ) : (
                                "Upload File"
                            )
                        }
                    </Button>
                </div>
                {
                    formData.image && (
                        <img
                            src={formData.image}
                            alt='main image file'
                            className='w-full h-64 object-cover'
                        />
                    )
                }
                {
                    imageUploadError &&
                    <Alert color='failure'>{imageUploadError}</Alert>
                }
                <ReactQuill theme='snow' placeholder='write something...' className='h-72' onChange={(value) => {
                    setFormData({ ...formData, content: value });
                }} />
                <Button type='submit'>Publish</Button>
                {
                    publishPostError && <Alert color='failure'>{publishPostError}</Alert>
                }
            </form>
        </div>
    );
}

export default CreatePost;
