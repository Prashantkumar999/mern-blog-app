import { Button, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermFormUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFormUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'uncategorized',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const response = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (response.ok) {
      const data = await response.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 p-4'>
      {/* Sidebar */}
      <aside className='lg:w-[30%] w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Search Term</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className='mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Sort By</label>
            <Select id='sort' value={sidebarData.sort} onChange={handleChange} className='mt-1'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Category</label>
            <Select id='category' value={sidebarData.category} onChange={handleChange} className='mt-1'>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white'>
            Apply Filters
          </Button>
        </form>
      </aside>

      {/* Results */}
      <main className='flex-1 p-2'>
        <h1 className='text-3xl font-semibold mb-4 text-center'>Search Results</h1>
        <div className='flex flex-wrap gap-4 justify-center'>
          {loading && <p>Loading...</p>}
          {!loading && posts.length === 0 && <p>No Posts Found</p>}
          {!loading && posts.map((post) => (
            <PostCard key={post._id} article={post} />
          ))}
        </div>

        {/* Show More */}
        {showMore && !loading && (
          <div className='mt-6 text-center'>
            <Button onClick={handleShowMore} className='bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'>
              Show More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
