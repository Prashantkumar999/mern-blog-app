import React, { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiDocument, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice'
import { HiDocumentText } from 'react-icons/hi'

const DashboardSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state)=>state.user)
  console.log(currentUser)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get('tab');
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);
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
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Use `as={Link}` to render Sidebar.Item as Link */}
          <Sidebar.Item
            as={Link}
            to='/dashboard?tab=profile'
            active={tab === 'profile'}
            icon={HiUser}
            label={currentUser.isAdmin?"Admin":"User"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          {
            currentUser.isAdmin && (
              <Link to='/dashboard?tab=posts'>
            <Sidebar.Item
              active={tab === 'posts'}
              icon={HiDocumentText}
              as='div'
            >Posts</Sidebar.Item>
          </Link>
            )
          }
          <Sidebar.Item
            icon={HiArrowSmRight}
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
