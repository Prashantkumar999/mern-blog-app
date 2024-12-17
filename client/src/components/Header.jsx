import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, TextInput } from 'flowbite-react';
import { CiSearch } from "react-icons/ci";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';


const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme)
    const path = useLocation().pathname;
    const location = useLocation();
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSignOut = async () => {
        try {
            const response = await fetch('/api/user/signout',
                {
                    method: "POST"
                });
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search])
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }
    return (
        <Navbar className='z-50'>
            <Link to={'/'}>
                <p className='font-bold text-2xl'>TechShot</p>
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput placeholder='Search Here...'
                    value={searchTerm}
                    type='text'
                    rightIcon={CiSearch}
                    className='hidden lg:block'
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Button color='gray' className='w-12 h-10 lg:hidden flex items-center' pill  onClick={()=>navigate('/search')}>
                <CiSearch />
            </Button>
            <div className='flex gap-3 md:order-2'>
                <Button className='w-12 h-10 hidden lg:flex items-center sm:inline bg-black' pill onClick={() => dispatch(toggleTheme())}>
                    {
                        theme === 'light' ? <FaMoon /> : <FaSun />
                    }
                </Button>
                {
                    currentUser ? (
                        <Dropdown arrowIcon={false}
                            inline
                            label={
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                                    <img
                                        alt="user image"
                                        src={currentUser.profilePicture}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            }
                        >
                            <Dropdown.Header className='flex flex-col gap-1 justify-center items-center z-50'>
                                <div className='W-full flex justify-center'>
                                    <img src={currentUser.profilePicture} className='rounded-full w-20 h-20' />
                                </div>
                                <span className='block font-semibold'>@{currentUser.username}</span>
                                <span className='font-semibold'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <DropdownItem>Profile</DropdownItem>
                                <DropdownDivider />
                                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
                            </Link>
                        </Dropdown>
                    ) : (<Link to={"/signin"}>
                        <Button color='gray' className='bg-gray-400 text-white' pill>
                            Sign In
                        </Button>
                    </Link>)
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to={"/"}>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to={"/about"}>
                        About Me
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    );
}

export default Header;
