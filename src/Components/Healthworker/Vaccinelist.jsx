import React, { useState, useEffect } from "react";
import { Card, Avatar, Spin, Layout, message, Button } from "antd";
import Sidebar from "./Sidebar";
import axiosInstance from "../../../api/axiosConfig";
import AddVaccineModal from "./AddVaccineModal.jsx";
import background from '../../img/bg-image-work.jpg'

const { Sider, Content, Header } = Layout;

const HealthVaccine = () => {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
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



    const fetchVaccines = async () => {
        try {
            const response = await axiosInstance.get("/api/vaccine/");
            setVaccines(response.data);
        } catch (err) {
            setError("Failed to fetch vaccines");
            message.error("Error loading vaccine data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccines();
    }, []);

    const handleAddVaccine = (newVaccine) => {
        setVaccines([...vaccines, newVaccine]);
    };

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Layout className="min-h-screen">
            <Sidebar/>
            <Layout>
                 <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                                    <h2 className="text-4xl font-semibold">Vaccine List</h2>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-semibold">{userDetails.fname} {userDetails.lname}</span>
                                        <Avatar size="large" className="bg-gray-300">
                                            {userDetails.fname.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </div>
                                </Header>
                <Content
                           className="p-6 bg-cover bg-center"
                           style={{ backgroundImage: `url(${background})` }}
                           >
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin size="large" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vaccines.map((vaccine) => (
                                <Card
                                    key={vaccine.id}
                                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                                    title={vaccine.name}
                                    extra={
                                        <span className={`font-semibold ${vaccine.status ? "text-green-500" : "text-red-500"}`}>
                                            {vaccine.status ? "Available" : "Unavailable"}
                                        </span>
                                    }
                                >
                                    <p><strong>Type:</strong> {vaccine.type}</p>
                                    <p><strong>Dosage Info:</strong> {vaccine.dosage_info}</p>
                                    <p><strong>Expiry:</strong> {new Date(vaccine.expiry).toLocaleDateString()}</p>
                                    <p><strong>Available:</strong> {vaccine.available} pcs</p>
                                    <p><strong>Contraindications:</strong> {vaccine.contra}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                    <AddVaccineModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onAdd={handleAddVaccine}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default HealthVaccine;