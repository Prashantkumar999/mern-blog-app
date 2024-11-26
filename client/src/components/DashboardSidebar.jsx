import React, { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice'
const DashboardSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
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
            label="User"
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
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
