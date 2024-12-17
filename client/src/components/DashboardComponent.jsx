import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfoCard from './InfoCard';
import { FaUsers } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { RiArticleLine } from "react-icons/ri";
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';


const DashboardComponent = () => {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);

    const { currentUser } = useSelector((state) => state.user)
    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user/getusers?limit=5');
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }

        }
        const fetchComments = async () => {
            try {
                const response = await fetch('/api/comment/getcomments?limit=5');
                const data = await response.json();
                if (response.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/post/getposts?limit=5');
                const data = await response.json();
                if (response.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        if (currentUser.isAdmin) {
            fetchComments();
            fetchPosts();
            fetchUsers();
        }

    }, [currentUser])
console.log(comments)

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 mx-3">
                <InfoCard text="Total Users" icon={<FaUsers />} total={totalUsers} lastMonth={lastMonthUsers} />
                <InfoCard text="Total Posts" icon={<RiArticleLine />} total={totalPosts} lastMonth={lastMonthPosts} />
                <InfoCard text="Total Comments" icon={<LiaCommentSolid />} total={totalComments} lastMonth={lastMonthComments} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-10'>
                <div>
                <div className='flex gap-2 items-center justify-between mx-3 my-2'>
                    <p className='font-semibold'>
                        Recent Users
                    </p>
                    <Link to='/dashboard?tab=users'>
                    <Button type='button' color='green'>
                        See All
                    </Button>
                    </Link>
                </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {
                                users.map((user) => (
                                    <Table.Row>
                                        <Table.Cell><img src={user.profilePicture} width={50} height={50} /></Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                </div>
                <div>
                <div className='flex gap-2 items-center justify-between mx-3 my-2'>
                    <p className='font-semibold'>
                        Recent Comments
                    </p>
                    <Link to='/dashboard?tab=comments'>
                    <Button type='button' color='green'>
                        See All
                    </Button>
                    </Link>
                </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {
                                comments.map((comment) => (
                                    <Table.Row>
                                        <Table.Cell>{comment.content}</Table.Cell>
                                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <div>
            <div className='flex gap-2 items-center justify-between mx-3 my-2'>
                    <p className='font-semibold'>
                        Recent Posts
                    </p>
                    <Link to='/dashboard?tab=posts'>
                    <Button type='button' color='green'>
                        See All
                    </Button>
                    </Link>
                </div>
            <Table>
                        <Table.Head>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {
                                posts.map((post) => (
                                    <Table.Row>
                                    <Link to={`/post/${post.slug}`}>
                                        <Table.Cell><img src={post.image}/></Table.Cell>
                                    </Link>
                                        <Table.Cell>{post.title}</Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
            </div>
        </div>
    );

}

export default DashboardComponent;
