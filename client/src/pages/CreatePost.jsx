import React from 'react';
import { Select, TextInput,FileInput, Button } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    return (
        <div>
            <form className='flex flex-col w-[50%] mx-auto  m-3 p-3 gap-3'>
                <div className='flex flex-col sm:flex-row gap-3'>
                    <TextInput type='text' required id='title' placeholder='title' className='flex-1' />
                    <Select>
                        <option value="uncategorized" disabled selected hidden>select a category</option>
                        <option value="javascript">javascript</option>
                        <option value="reactjs">reactjs</option>
                        <option value="nextjs">nextjs</option>
                    </Select>
                </div>
                <div className='flex justify-between gap-3'>
                    <FileInput type='file' accept='image/*' className='flex-1' />
                    <Button>Upload Image</Button>
                </div>
                <ReactQuill theme='snow' placeholder='write something...' className='h-72' />
                <Button type='submit'>Publish</Button>
            </form>
        </div>
    );
}

export default CreatePost;
