import { Table, Modal, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PiSealWarningFill } from 'react-icons/pi';
import { RxCross1 } from 'react-icons/rx';
import { GiCheckMark } from 'react-icons/gi';

const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/user/getusers`);
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                    setShowMore(data.users.length >= 9);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        if (currentUser?.isAdmin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await response.json();
            if (response.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                setShowMore(data.users.length >= 9);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setShowConfirmationScreen(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!currentUser?.isAdmin) {
        return <p className="text-center mt-4">Access denied. Admins only.</p>;
    }

    return (
        <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-slate-600 dark:scrollbar-trak-400" style={{ maxHeight: '80vh' }}>
            {loading ? (
                <p className="text-center font-medium text-gray-500">Loading users...</p>
            ) : users.length > 0 ? (
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
                                <Table.Row key={user._id} className="bg-white border-y-2 dark:bg-gray-800 dark:border-gray-700">
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture || '/default-avatar.png'}
                                            alt={user.username}
                                            onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                            className="w-16 h-16 object-cover bg-gray-500 rounded-full"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <GiCheckMark className="text-green-500" />
                                        ) : (
                                            <RxCross1 className="text-red-500" />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowConfirmationScreen(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className="text-red-500 cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>

                    {showMore && (
                        <button onClick={handleShowMore} className="w-full text-blue-500 py-2 hover:underline">
                            Show More
                        </button>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 mt-4">No users found.</p>
            )}

            <Modal show={showConfirmationScreen} onClose={() => setShowConfirmationScreen(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <PiSealWarningFill className="w-12 h-12 text-yellow-500" />
                        <p className="text-lg font-medium">Are you sure you want to delete this user?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Yes, delete
                            </Button>
                            <Button color="gray" onClick={() => setShowConfirmationScreen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashUsers;
