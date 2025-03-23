import React, { useState, useEffect } from 'react';
import { Card, Avatar, Layout } from 'antd';
import Sidebar from '../Sidebar/Sidebar';
import axiosInstance from '../../../api/axiosConfig';
import { Syringe, MapPin, ShieldCheck, Baby, UserCheck } from 'lucide-react';
import background from '../../img/bg-image-admin.jpg';

const { Sider, Content, Header } = Layout;

const Dashboard = () => {
    const [adminDetails, setAdminDetails] = useState(null);
    const [vaccineTotal, setVaccineTotal] = useState(0);
const [purokTotal, setPurokTotal] = useState(0);
const [infantTotal, setInfantTotal] = useState(0);
const [vaccinatedTotal, setVaccinatedTotal] = useState(0);
const [healthworkerTotal, setHealthworkerTotal] = useState(0);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/api/auth/admin-details', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAdminDetails(response.data.admin);
            } catch (error) {
                console.error('Error fetching admin details:', error.response?.data?.message);
            }
        };

        fetchAdminDetails();
    }, []);

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const [vaccineRes, purokRes, infantRes, vaccinatedRes, healthworkerRes] = await Promise.all([
                    axiosInstance.get('/api/vaccine/total'),
                    axiosInstance.get('/api/purok/total'),
                    axiosInstance.get('/api/infant/totalinfant/total'),
                    axiosInstance.get('/api/vaccination/total/vaccinated'),
                    axiosInstance.get('/api/health/total/healthworker'),
                ]);
    
                console.log("Vaccine Total:", vaccineRes.data);
                console.log("Purok Total:", purokRes.data);
                console.log("Infant Total:", infantRes.data);
                console.log("Vaccinated Total:", vaccinatedRes.data);
                console.log("Healthworker Total:", healthworkerRes.data);
    
                setVaccineTotal(vaccineRes.data.total);
                setPurokTotal(purokRes.data.total);
                setInfantTotal(infantRes.data.total);
                setVaccinatedTotal(vaccinatedRes.data.total);
                setHealthworkerTotal(healthworkerRes.data.total);
            } catch (error) {
                console.error('Error fetching totals:', error.response?.data?.message);
            }
        };
    
        fetchTotals();
    }, []);
    
    

    const cardData = [
        { icon: <Syringe className='h-12 w-12 text-blue-500' />, title: 'Vaccine Listed', count: vaccineTotal },
        { icon: <MapPin className='h-12 w-12 text-green-500' />, title: 'Vaccination Center', count: purokTotal },
        { icon: <ShieldCheck className='h-12 w-12 text-teal-500' />, title: 'Fully Vaccinated', count: vaccinatedTotal },
        { icon: <Baby className='h-12 w-12 text-pink-500' />, title: 'Infant List', count: infantTotal },
        { icon: <UserCheck className='h-12 w-12 text-purple-500' />, title: 'Healthworker List', count: healthworkerTotal },
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

export default Dashboard;