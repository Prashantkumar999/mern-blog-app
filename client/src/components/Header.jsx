import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Navbar, TextInput } from 'flowbite-react';
import { CiSearch } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";


const Header = () => {
    const path = useLocation().pathname
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
                <Button className='w-12 h-10 hidden lg:flex items-center sm:inline bg-black' pill>
                    <FaMoon />
                </Button>
                <Link to={"/signin"}>
                    <Button color='gray' className='bg-gray-400 text-white' pill>
                        Sign In
                    </Button>
                </Link>
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
