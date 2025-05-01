import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  TextInput,
  Tooltip
} from 'flowbite-react';
import { CiSearch } from "react-icons/ci";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Navbar className='z-50 shadow-sm px-4'>
      {/* Logo */}
      <Link to='/' className='text-2xl font-bold tracking-tight'>
        TechShot
      </Link>

      {/* Search Bar - Desktop */}
      <form onSubmit={handleSubmit} className='hidden lg:flex w-1/3'>
        <TextInput
          placeholder='Search here...'
          value={searchTerm}
          type='text'
          rightIcon={CiSearch}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* Right Section */}
      <div className='flex items-center gap-3 md:order-2'>
        {/* Search Button - Mobile */}
        <Button pill color='gray' className='w-10 h-10 lg:hidden' onClick={() => navigate('/search')}>
          <CiSearch />
        </Button>

        {/* Theme Toggle */}
        <Tooltip content={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
          <Button
            pill
            color='gray'
            className='w-10 h-10 hidden sm:flex items-center justify-center'
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </Button>
        </Tooltip>

        {/* User Dropdown or Sign In */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-300'>
                <img
                  alt='user'
                  src={currentUser.profilePicture}
                  className='w-full h-full object-cover'
                />
              </div>
            }
          >
            <DropdownHeader className='flex flex-col items-center'>
              <img src={currentUser.profilePicture} alt="user" className='rounded-full w-16 h-16 mb-2' />
              <span className='font-semibold'>@{currentUser.username}</span>
              <span className='text-sm'>{currentUser.email}</span>
            </DropdownHeader>

            <Link to='/dashboard?tab=profile'>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button pill color='gray' className='text-white bg-gray-500'>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      {/* Nav Links */}
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as='div'>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as='div'>
          <Link to='/about'>About Me</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/blogs'} as='div'>
          <Link to='/blogs'>Blogs</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
