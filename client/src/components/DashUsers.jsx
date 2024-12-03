import { Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'flowbite-react';
import { PiSealWarningFill } from 'react-icons/pi'
import { RxCross1 } from "react-icons/rx";
import { GiCheckMark } from "react-icons/gi";



const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/user/getusers`);
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`);

            const data = await response.json();
            if (response.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }
  const handleDeleteUser = async()=>{

  }
  console.log(users)
    return (
        <div
            className="table-auto overflow-x-auto md:mx-auto p-3  scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-slate-600 dark:scrollbar-trak-400"
            style={{
                maxHeight: '80vh', // Limit vertical height if necessary
            }}
        >
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md w-[90%] mx-auto mt-1">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {users.map((user) => (
                                <Table.Row
                                    key={user._id}
                                    className="bg-white border-y-2 dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>

                                            <img
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className="w-16 h-16 object-cover bg-gray-500 rounded-full"
                                            />
                                       
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.username}
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.isAdmin?(<GiCheckMark className='text-green-500'/>):(<RxCross1 className='text-red-500'/>)}</Table.Cell>
                            
                                    <Table.Cell>
                                        <span onClick={() => {
                                            setShowConfirmationScreen(true);
                                            setUserIdToDelete(user._id);
                                        }} className="text-red-500 cursor-pointer">Delete</span>
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
                <p>You have no users yet</p>
            )}
            <Modal show={showConfirmationScreen} onClose={() => setShowConfirmationScreen(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='flex justify-center flex-col items-center gap-4'>
                        <PiSealWarningFill className='w-12 h-12' />
                        <p>Do You Really Want To Delete Your User?</p>
                        <div className='flex justify-between gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes I'm Sure
                            </Button>
                            <Button color='gray' onClick={() => setShowConfirmationScreen(false)}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashUsers;
