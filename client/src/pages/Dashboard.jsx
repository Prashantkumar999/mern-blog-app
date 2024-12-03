import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers'
const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFormUrl = urlParams.get('tab');
        if (tabFormUrl) {
            setTab(tabFormUrl)
        }

    }, [location.search])
    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            {/* sidebar*/}
            <div>
                <DashboardSidebar />
            </div>
            {/* profile */}
            <div className='w-full'>
                {
                    tab === 'profile' && <DashboardProfile />
                }
            {tab==='posts' && <DashPosts/>}
            {tab==='users' && <DashUsers/>}
            </div>
        </div>
    );
}

export default Dashboard;
