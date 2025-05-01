import { useEffect, useState } from 'react';
import { Spinner, Button } from 'flowbite-react';
import PostCard from '../components/PostCard';

export default function AllBlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const POSTS_LIMIT = 6;

  const fetchPosts = async (startIndex = 0) => {
    try {
      if (startIndex === 0) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}&limit=${POSTS_LIMIT}`);
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [...prev, ...data.posts]);
        if (data.posts.length < POSTS_LIMIT) setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto min-h-screen py-10">
      <h1 className="text-3xl font-bold text-center mb-10">All Blog Posts</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post._id} article={post} />
            ))}
          </div>

          {showMore && !loadingMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => fetchPosts(posts.length)}>Show More</Button>
            </div>
          )}

          {loadingMore && (
            <div className="flex justify-center mt-5">
              <Spinner size="sm" />
            </div>
          )}
        </>
      )}
    </main>
  );
}
