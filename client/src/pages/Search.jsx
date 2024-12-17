import { Button, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
        const categoryFromUrl = urlParams.get('category')

        if (searchTermFormUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFormUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            })
        }
        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            console.log("search query", searchQuery)
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                console.log("this is data", data)
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                }
                else {
                    setShowMore(false);
                }
            }
        }
        fetchPosts();
    }, [location.search])
    // console.log(posts)
    // console.log(sidebarData)
    const handleChange = (event) => {
        if (event.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData, searchTerm: event.target.value
            })
        }
        if (event.target.id === 'sort') {
            const order = event.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (event.target.id === 'category') {
            const category = event.target.value || 'uncategorized';
            setSidebarData({ ...sidebarData, category });
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!response.ok) {
            return;
        }
        if (response.ok) {
            const data = await response.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            }
            else {
                setShowMore(false);
            }
        }
    }
    return (
        <div className='flex flex-col sm:flex-row gap-2 '>
            <div className='w-[40%] text-md font-semibold'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full'>
                    <div>
                        <label>Search Term</label>
                        <TextInput placeholder='Search...' id='searchTerm' type='text' value={sidebarData.searchTerm}
                            onChange={handleChange} />
                    </div>
                    <div>
                        <label>
                            Sort:
                        </label>
                        <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div>
                        <label>
                            Category:
                        </label>
                        <Select onChange={handleChange} value={sidebarData.category} id='category'>
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='reactjs'>React.js</option>
                            <option value='nextjs'>Next.js</option>
                            <option value='javascript'>javascript</option>
                        </Select>
                    </div>
                    <Button type='submit'>
                        Search
                    </Button>
                </form>
            </div>
            <div className='flex justify-center flex-col items-center'>
                <h1 className='text-4xl font-semibold py-2'>Results</h1>
                <div className='flex flex-wrap justify-center items-center mx-auto gap-2'>
                    {
                        !loading && posts.length === 0 && (<p>No Posts Found</p>)
                    }
                    {
                        loading && (
                            <p>Loading...</p>
                        )
                    }
                    {
                        !loading && posts &&
                        posts.map((post) => (
                            <PostCard key={post.id} article={post} />
                        ))
                    }
                </div>
                {
                    showMore && <button className='' onClick={handleShowMore}>Show More</button>
                }
            </div>
        </div>
    );
}

export default Search;
