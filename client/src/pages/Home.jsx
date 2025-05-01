import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import HomePageHeroSec from '../components/HomePageHeroSec';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [recentPostsLoading, setRecentPostsLoading] = useState(false);

  const POSTS_LIMIT = 6;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch post');
        setPost(data.posts[0]);
        setError(false);
      } catch (error) {
        console.error(error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  const fetchRecentPosts = async (startIndex = 0) => {
    try {
      setRecentPostsLoading(true);
      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}&limit=${POSTS_LIMIT}`);
      const data = await res.json();
      if (res.ok) {
        const newPosts = data.posts;
        setRecentPosts((prev) => [...prev, ...newPosts]);
        if (newPosts.length < POSTS_LIMIT) setShowMore(false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setRecentPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto flex flex-col gap-10 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto w-full mt-4">
        <HomePageHeroSec />
      </section>

      {/* Recent Articles */}
      <section className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Recent Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {recentPosts.map((post) => (
            <PostCard key={post._id} article={post} />
          ))}
        </div>

        {/* Show More Button */}
        {showMore && !recentPostsLoading && (
          <Button
            onClick={() => fetchRecentPosts(recentPosts.length)}
            className="mt-6"
          >
            Show More
          </Button>
        )}

        {/* Spinner for loading more */}
        {recentPostsLoading && (
          <div className="mt-6">
            <Spinner size="sm" />
          </div>
        )}
      </section>
    </main>
  );
}
