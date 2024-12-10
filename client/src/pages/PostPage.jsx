import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentArticles, setRecentArticles] = useState(null);

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

    useEffect(() => {
        try {
            const fetchRecentArticles = async()=>{
                const res = await fetch(`/api/post/getPosts?limit=3`)
                const data = await res.json();
                if(res.ok){
                    setRecentArticles(data.posts);
                }
            }
            fetchRecentArticles();
        } catch (error) {
            console.log(error.message);
        }
    }, [])
    console.log(recentArticles)

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
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />
            <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Articles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentArticles &&
            recentArticles.map((article) => (
                <PostCard key={article._id} article={article} />
            ))}
    </div>
</div>

        </main>
    );
};

export default PostPage;
