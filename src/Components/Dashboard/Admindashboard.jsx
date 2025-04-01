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
    const [vaccinationToday, setVaccinationToday] = useState([]);

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

    useEffect(() => {
        const fetchVaccinationToday = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/api/vaccination/today');
                const formattedData = data.map(vaccine => ({
                    vaccine_name: vaccine.vaccine_name,
                    member_name: `${vaccine.member_fname} ${vaccine.member_lname} ${vaccine.member_suffix || ''}`.trim(),
                    sched_time: dayjs(vaccine.sched_time, 'HH:mm:ss').format('hh:mm A'), // Convert to 12-hour format
                }));
                setVaccinationToday(formattedData);
            } catch (err) {
                setError('Failed to fetch vaccination data');
                message.error('Error loading vaccination data');
            } finally {
                setLoading(false);
            }
        };
        fetchVaccinationToday();
    }, []);

    return (
        <Layout className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Layout */}
        <Layout className="flex-1">
          <Header className="bg-white p-6 shadow-md flex items-center">
            <h2 className="text-4xl font-semibold">Admin Dashboard</h2>
          </Header>
  
          <Content
            className="p-8 bg-cover bg-center relative flex flex-col items-center"
            style={{ backgroundImage: `url(${background})` }}
          >
            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {cardData.map((item, index) => (
                <Card
                  key={index}
                  className="rounded-2xl shadow-lg flex flex-col justify-center items-center h-44 bg-white bg-opacity-90 backdrop-blur-md transition-transform hover:scale-105 duration-300"
                >
                  {item.icon}
                  <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                  <p className="text-3xl font-semibold">{item.count}</p>
                </Card>
              ))}
            </div>
            
  
            {/* Vaccination Today Section */}
            <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Vaccination Today</h3>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : vaccinationToday.length > 0 ? (
                <List
                  dataSource={vaccinationToday}
                  renderItem={(item) => (
                    <List.Item className="flex justify-between items-center">
                      <Badge color="blue" text={item.vaccine_name} />
                      <span className="font-semibold">{item.member_name}</span>
                      <span className="text-gray-600">{item.sched_time}</span>
                    </List.Item>
                  )}
                />
              ) : (
                <p className="text-gray-600">No vaccinations scheduled for today.</p>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
};

export default Dashboard;
