import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, TextInput } from 'flowbite-react';
import { CiSearch } from "react-icons/ci";
import { FaMoon,FaSun } from "react-icons/fa";
import {useSelector, useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';


const Header = () => {
    const dispatch = useDispatch();
const {theme} = useSelector((state)=>state.theme)
    const path = useLocation().pathname
    const {currentUser} = useSelector(state =>state.user)
    return (
        <Navbar>
            <Link className='bg-red-400'>
                Logo
            </Link>
            <form>
                <TextInput placeholder='Search Here...'
                    type='text'
                    rightIcon={CiSearch}
                    className='hidden lg:block'
                />
            </form>
            <Button color='gray' className='w-12 h-10 lg:hidden flex items-center' pill >
                <CiSearch />
            </Button>
            <div className='flex gap-3 md:order-2'>
                <Button className='w-12 h-10 hidden lg:flex items-center sm:inline bg-black' pill onClick={()=>dispatch(toggleTheme())}>
                  {
                    theme === 'light' ? <FaMoon /> : <FaSun/>
                  }
                </Button>
               {
                currentUser? (
                    <Dropdown arrowIcon={false}
                    inline 
                    label={<Avatar alt='user image' img={currentUser.profilePicture} rounded/>}
                    >
<Dropdown.Header className='flex flex-col gap-1 justify-center items-center'>
<div className='W-full flex justify-center'>
<img src={currentUser.profilePicture}  className='rounded-full'/>
</div>
    <span className='block font-semibold'>@{currentUser.username}</span>
    <span className='font-semibold'>{currentUser.email}</span>
</Dropdown.Header>
<Link to={'/dashboard?tab=profile'}>
<DropdownItem>Profile</DropdownItem>
<DropdownDivider/>
<DropdownItem>Sign Out</DropdownItem>
</Link>
                    </Dropdown>
                ) : ( <Link to={"/signin"}>
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
                        About Us
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={'div'}>
                    <Link to={"/projects"}>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    );
}

export default Header;
