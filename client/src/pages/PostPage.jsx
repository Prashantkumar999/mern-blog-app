import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
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

                if (!response.ok) throw new Error('Failed to fetch post');

                setPost(data.posts[0]);
                setError(false);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        const fetchRecentArticles = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?limit=3`);
                const data = await res.json();
                if (res.ok) {
                    setRecentArticles(data.posts);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchRecentArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Spinner size="xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
                Something went wrong! Please try again later.
            </div>
        );
    }

    return (
        <main className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto flex flex-col gap-8">
            <section className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{post?.title}</h1>
                <Link to={`/search?category=${post?.category}`}>
                    <Button outline className="mt-2">{post?.category}</Button>
                </Link>
            </section>

            <img
                className="w-full max-h-[600px] object-cover rounded-xl shadow"
                src={post?.image}
                alt={post?.title}
            />

            <div className="flex justify-between text-sm text-gray-500 px-2 sm:px-0">
                <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                <span className="italic">{Math.ceil(post?.content.length / 1000)} mins read</span>
            </div>

            <article
                className="post-content prose max-w-none text-justify leading-relaxed text-gray-700 px-2 sm:px-0"
                dangerouslySetInnerHTML={{ __html: post?.content }}
            ></article>

            <CallToAction />

            <CommentSection postId={post._id} />

            <section className="w-full mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentArticles &&
                        recentArticles.map((article) => (
                            <PostCard key={article._id} article={article} />
                        ))}
                </div>
            </section>
        </main>
    );
};

export default PostPage;
