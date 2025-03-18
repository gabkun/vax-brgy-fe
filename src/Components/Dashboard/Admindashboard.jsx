import React from 'react';
import {useState, useEffect} from 'react';
import { Card, Button, Menu, Layout, Avatar } from 'antd';
import Sidebar from '../Sidebar/Sidebar';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import background from '../../img/bg-image-admin.jpg'

const { Sider, Content, Header } = Layout;

const Dashboard = () => {
    const [adminDetails, setAdminDetails] = useState(null);

    // Fetch admin details on component mount
    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/api/auth/admin-details", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAdminDetails(response.data.admin);
            } catch (error) {
                console.error("Error fetching admin details:", error.response?.data?.message);
            }
        };

        fetchAdminDetails();
    }, []);


    return (
        <Layout className="min-h-screen">
            <Sidebar/>
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Admin Dashboard</h2>
                    <Avatar size="large" className="bg-gray-300" />
                </Header>
                <Content
  className="p-6 bg-cover bg-center"
  style={{ backgroundImage: `url(${background})` }}
>
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

export default Dashboard;
