import React, { useState, useEffect } from 'react';
import { Card, Spin, Layout, message, Button, Modal, Form, Input, Select, Tag } from 'antd';
import Sidebar from './Sidebar';
import axiosInstance from '../../../api/axiosConfig';
import background from '../../img/bg-image-work.jpg'

const { Sider, Content, Header } = Layout;
const { Option } = Select;

const HealthVaccination = () => {
    const [vaccinations, setVaccinations] = useState([]);
    const [healthWorkers, setHealthWorkers] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [form] = Form.useForm();

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [vaccinationRes, vaccineRes, workerRes] = await Promise.all([
                    axiosInstance.get('/api/vaccination/'),
                    axiosInstance.get('/api/vaccine/'),
                    axiosInstance.get('/api/health/approved'),
                ]);
                setVaccinations(Array.isArray(vaccinationRes.data) ? vaccinationRes.data : []);
                setVaccines(Array.isArray(vaccineRes.data) ? vaccineRes.data : []);
                setHealthWorkers(Array.isArray(workerRes.data) ? workerRes.data : []);
                console.log("Vaccinations:", vaccinationRes.data);
                console.log("Health Workers:", workerRes.data);
            } catch (err) {
                setError('Failed to fetch data');
                message.error('Error loading data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const memberRes = await axiosInstance.get('/api/infant');
                setMembers(memberRes.data.data);  
                console.log("Loaded members:", memberRes.data.data);  
            } catch (err) {
                setError("Failed to fetch members");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    // Handle adding a new vaccination
    const handleAddVaccination = async (values) => {
        try {
            await axiosInstance.post('/api/vaccination/create', values);
            message.success('Vaccine created successfully');
            form.resetFields();
            setIsModalOpen(false);
        } catch (err) {
            message.error('Failed to create vaccine');
        }
    };

    // Handle viewing a vaccination record
    const handleViewVaccination = async (id) => {
        try {
            const response = await axiosInstance.get(`/api/vaccination/${id}`);
            setViewData(response.data);
            setIsViewModalOpen(true);
        } catch (err) {
            message.error('Failed to load vaccination details');
        }
    };

    // Format date to a readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Status labels based on vaccination status
    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return <Tag color="green">Active</Tag>;
            case 2:
                return <Tag color="blue">Completed</Tag>;
            case 0:
                return <Tag color="gray">Absent</Tag>;
            default:
                return <Tag color="orange">Unknown</Tag>;
        }
    };

    const handleSetCompleted = async (id) => {
        try {
            const response = await axiosInstance.put(`/api/vaccination/completed/${id}`);
            message.success(response.data.message);
            setIsViewModalOpen(false);
            // Refresh the list or update UI here
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to mark as completed");
        }
    };
    
    const handleSetCancelled = async (id) => {
        try {
            const response = await axiosInstance.put(`/api/vaccination/cancelled/${id}`);
            message.success(response.data.message);
            setIsViewModalOpen(false);
            // Refresh the list or update UI here
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to mark as cancelled");
        }
    };
    

    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Vaccination History</h2>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Add Vaccination</Button>
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
                            {vaccinations.map((vaccine) => (
                                <Card
                                    key={vaccine.id}
                                    className="shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                                >
                                    <h3 className="text-2xl font-bold mb-2">
                                        {vaccine.member_lname}, {vaccine.member_fname} {vaccine.suffix}
                                    </h3>
                                    <p className="text-lg"><strong>Scheduled Date:</strong> {formatDate(vaccine.sched_date)}</p>
                                    <p className="text-lg"><strong>Vaccine:</strong> {vaccine.vaccine_name}</p>
                                    <p className="text-lg"><strong>Status:</strong> {getStatusLabel(vaccine.status)}</p>
                                    <p className="text-lg"><strong>Time:</strong> {vaccine.sched_time}</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button type="primary" onClick={() => handleViewVaccination(vaccine.id)}>View</Button>
                                        <Button type="default">Edit</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Content>
            </Layout>

            <Modal
                title="Add Vaccination"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleAddVaccination} layout="vertical">
                    <Form.Item name="sched_date" label="Schedule Date" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="sched_time" label="Schedule Time" rules={[{ required: true }]}>
                        <Input type="time" />
                    </Form.Item>
                    <Form.Item name="vaccine_id" label="Vaccine" rules={[{ required: true }]}>
                        <Select placeholder="Select Vaccine">
                            {vaccines.map((vaccine) => (
                                <Option key={vaccine.id} value={vaccine.id}>{vaccine.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
    title="Vaccination Details"
    open={isViewModalOpen}
    onCancel={() => setIsViewModalOpen(false)}
    footer={
        viewData?.status === 1 ? [
            <Button 
                key="completed" 
                type="primary" 
                style={{ backgroundColor: "green", borderColor: "green" }}
                onClick={() => handleSetCompleted(viewData.id)}
            >
                Completed
            </Button>,
            <Button 
                key="cancelled" 
                type="primary" 
                danger 
                style={{ backgroundColor: "red", borderColor: "red" }}
                onClick={() => handleSetCancelled(viewData.id)}
            >
                Cancelled
            </Button>,
        ] : null
    }
>
    {viewData && (
        <>
            <p><strong>Vaccine:</strong> {viewData.vaccine_name}</p>
            <p><strong>Assigned Worker:</strong> {viewData.worker_fname} {viewData.worker_lname}</p>
            <p><strong>Infant Name:</strong> {viewData.member_fname} {viewData.member_lname}</p>
            <p><strong>Created:</strong> {formatDate(viewData.created)}</p>
        </>
    )}
</Modal>


        </Layout>
    );
};

export default HealthVaccination;
