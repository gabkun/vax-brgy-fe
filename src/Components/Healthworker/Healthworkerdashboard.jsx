import React, { useEffect, useState } from 'react';
import { Card, Button, Layout, Avatar } from 'antd';
import axiosInstance from '../../../api/axiosConfig';
import { Syringe, MapPin, ShieldCheck, Baby, UserCheck } from 'lucide-react';
import Sidebar from './Sidebar';
import background from '../../img/bg-image-work.jpg'

const { Sider, Content, Header } = Layout;

const HworkerDashboard = () => {
    const [userDetails, setUserDetails] = useState(null);

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/api/auth/user-details', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserDetails(response.data.user);
            } catch (error) {
                console.error('Error fetching user details:', error.response?.data?.message);
            }
        };

        fetchUserDetails();
    }, []);

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    
        const cardData = [
            { icon: <Syringe className='h-12 w-12 text-blue-500' />, title: 'Vaccine Listed', count: 5 },
            { icon: <MapPin className='h-12 w-12 text-green-500' />, title: 'Purok List', count: 3 },
            { icon: <ShieldCheck className='h-12 w-12 text-teal-500' />, title: 'Fully Vaccinated', count: 2 },
            { icon: <Baby className='h-12 w-12 text-pink-500' />, title: 'Infant List', count: 3 },
        ];
    

    return (
        <Layout className='min-h-screen'>
        <Sidebar />
        <Layout>
            <Header className='bg-white p-6 shadow-md flex justify-between items-center'>
                <h2 className='text-4xl font-semibold'>Admin Dashboard</h2>
                <Avatar size='large' className='bg-gray-300' />
            </Header>
            <Content
                className='p-8 bg-cover bg-center relative flex items-center justify-center'
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className='absolute inset-0 bg-black opacity-40'></div>
                <div className='relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {cardData.map((item, index) => (
                        <Card
                            key={index}
                            className='rounded-2xl shadow-xl flex flex-col justify-center items-center h-44 w-72 bg-white bg-opacity-90 backdrop-blur-md hover:scale-105 transition-transform duration-300'
                        >
                            {item.icon}
                            <h3 className='text-xl font-bold mt-2'>{item.title}</h3>
                            <p className='text-3xl font-semibold'>{item.count}</p>
                        </Card>
                    ))}
                </div>
            </Content>
        </Layout>
    </Layout>
    );
};

export default HworkerDashboard;
