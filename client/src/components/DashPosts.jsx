import { Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await response.json();
                if (response.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const response = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);

            const data = await response.json();
            if (response.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div
            className="table-auto overflow-x-auto md:mx-auto p-3  scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-slate-600 dark:scrollbar-trak-400"
            style={{
                maxHeight: '80vh', // Limit vertical height if necessary
            }}
        >
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md w-[90%] mx-auto mt-1">
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {userPosts.map((post) => (
                                <Table.Row
                                    key={post._id}
                                    className="bg-white border-y-2 dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-16 h-16 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <span className="text-red-500">Delete</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className="text-blue-500">Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {
                        showMore && (
                            <button onClick={handleShowMore} className='w-full text-gray-400'>
                                Show More
                            </button>
                        )
                    }
                </>
            ) : (
                <p>You have no posts yet</p>
            )}
        </div>
    );
};

export default DashPosts;
