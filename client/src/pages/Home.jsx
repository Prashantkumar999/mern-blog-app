import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  const fetchRecentPosts = async (startIndex) => {
    try {
      setRecentPostsLoading(true);
      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}&limit=${POSTS_LIMIT}`);
      const data = await res.json();
      if (res.ok) {
        const newPosts = data.posts;
        setRecentPosts((prevPosts) => [...prevPosts, ...newPosts]);
        if (newPosts.length < POSTS_LIMIT) {
          setShowMore(false); // Hide "Show More" button if fewer posts are fetched
        }
      }
      setRecentPostsLoading(false);
    } catch (error) {
      console.log(error.message);
      setRecentPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className='max-w-4xl mx-auto w-full'>
      <HomePageHeroSec/>
      </div>
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-3xl mt-5 font-semibold '>Recent Articles</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} article={post} />)}
        </div>
        {showMore && !recentPostsLoading && (
          <Button
            onClick={() => fetchRecentPosts(recentPosts.length)}
            className='mt-5'
          >
            Show More
          </Button>
        )}
        {recentPostsLoading && (
          <div className='mt-5'>
            <Spinner size='sm' />
          </div>
        )}
      </div>
    </main>
  );
}
