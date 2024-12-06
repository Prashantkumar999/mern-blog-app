import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';

const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await response.json(); 

                if (!response.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Something went wrong! Please try again later.</p>
            </div>
        );
    }

    return (
        <main className="p-4 max-w-[90%] mx-auto flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 ">{post?.title}</h1>
            <Link to={`/search?category=${post?.category}`}>
                <Button outline className=' self-center'>{post?.category}</Button>
            </Link>
            <img
                className="my-4 w-full max-h-[600px]"
                src={post?.image}
                alt={post?.title}
            />
            <div className="w-full px-4 text-gray-500 flex justify-between">
                <span className="mr-4">{new Date(post?.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{Math.ceil(post?.content.length / 1000)} mins read</span>
            </div>
            {/* Rendering HTML content safely */}
            <div
            // post content index.css
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post?.content }}
            ></div>
            <div className='max-w-4xl mx-auto w-full'>
                <CallToAction/>
            </div>
            <CommentSection postId={post._id}/>
        </main>
    );
};

export default PostPage;
