import React, { useEffect, useState } from 'react';
import { Card, Button, Layout, Avatar } from 'antd';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from './Sidebar';

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

    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Healthworker Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold">{userDetails.fname} {userDetails.lname}</span>
                        <Avatar size="large" className="bg-gray-300">
                            {userDetails.fname.charAt(0).toUpperCase()}
                        </Avatar>
                    </div>
                </Header>
                <Content className="p-6 bg-gray-100">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="shadow-lg">
                            <h3 className="text-lg font-bold">Vaccine Listed</h3>
                            <p>5</p>
                        </Card>
                        <Card className="shadow-lg">
                            <h3 className="text-lg font-bold">Vaccination Center</h3>
                            <p>3</p>
                        </Card>
                        <Card className="shadow-lg">
                            <h3 className="text-lg font-bold">Fully Vaccinated</h3>
                            <p>2</p>
                        </Card>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Card className="shadow-lg">
                            <h3 className="text-lg font-bold">Infant List</h3>
                            <p>3</p>
                        </Card>
                        <Card className="shadow-lg">
                            <h3 className="text-lg font-bold">Healthworker List</h3>
                            <p>4</p>
                        </Card>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default HworkerDashboard;
