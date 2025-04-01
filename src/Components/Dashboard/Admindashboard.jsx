import React, { useState, useEffect } from 'react';
import { Card, Avatar, Layout, Calendar, Badge, Modal, List, Button, Spin, Tag, message } from 'antd';
import Sidebar from '../Sidebar/Sidebar';
import axiosInstance from '../../../api/axiosConfig';
import dayjs from 'dayjs';
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
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSchedModalOpen, setIsSchedModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/api/auth/admin-details', {
                    headers: { Authorization: `Bearer ${token}` },
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/api/vaccination/');
                setVaccinations(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to fetch data');
                message.error('Error loading data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getListData = (value) => {
        const dateStr = value.format("YYYY-MM-DD");
        return vaccinations
            .filter(vaccine => dayjs(vaccine.sched_date).format("YYYY-MM-DD") === dateStr)
            .map(vaccine => ({
                id: vaccine.id,
                type: vaccine.status === 2 ? "success" : "warning",
                name: `${vaccine.member_lname}, ${vaccine.member_fname} (${vaccine.vaccine_name})`,
                vaccine: vaccine.vaccine_name,
                member: `${vaccine.member_lname}, ${vaccine.member_fname} ${vaccine.suffix || ""}`,
                worker: `${vaccine.worker_fname} ${vaccine.worker_lname}`,
            }));
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => (
                    <li key={index} className="truncate cursor-pointer" onClick={() => handleDateClick(value)}>
                        <Badge status={item.type} text={item.name} />
                    </li>
                ))}
            </ul>
        );
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsSchedModalOpen(true);
    };

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
                           <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                               <h2 className="text-4xl font-semibold">Admin Dashboard</h2>
                           </Header>
                <Content className='p-8 bg-cover bg-center' style={{ backgroundImage: `url(${background})` }}>
                    <h2 className='text-3xl font-bold my-4'>Vaccination Schedules</h2>
                    <Calendar dateCellRender={dateCellRender} className='bg-white p-4 shadow-lg rounded-lg mb-6' onSelect={handleDateClick} />
                    <Modal title={`Vaccinations on ${selectedDate ? selectedDate.format("MM/DD/YYYY") : ""}`} open={isSchedModalOpen} onCancel={() => setIsSchedModalOpen(false)} footer={null}>
                        <List bordered dataSource={getListData(selectedDate || dayjs())} renderItem={(item) => (
                            <List.Item>
                                <strong>{item.member}</strong> - {item.vaccine} <br />
                                <strong>Health Worker Assigned:</strong> {item.worker}
                            </List.Item>
                        )} />
                    </Modal>
                </Content>
                <Content
                    className='p-8 bg-cover bg-center relative flex items-center justify-center'
                    style={{ backgroundImage: `url(${background})` }}
                >
                    <div className='absolute inset-0'></div>
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
