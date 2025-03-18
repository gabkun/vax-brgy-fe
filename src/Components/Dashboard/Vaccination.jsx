import React, { useState, useEffect } from 'react';
import { Card, Spin, Layout, message, Button, Modal, Form, Input, Select, Tag } from 'antd';
import Sidebar from '../Sidebar/Sidebar';
import axiosInstance from '../../../api/axiosConfig';
import background from '../../img/bg-image-admin.jpg'

const { Sider, Content, Header } = Layout;
const { Option } = Select;

const Vaccination = () => {
    const [vaccinations, setVaccinations] = useState([]);
    const [healthWorkers, setHealthWorkers] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                setMembers(memberRes.data.data);  // Access the 'data' key
                console.log("Loaded members:", memberRes.data.data);  // Debugging
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
            case 3:
                return <Tag color="gray">Absent</Tag>;
            default:
                return <Tag color="orange">Unknown</Tag>;
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
                                    <p className="text-lg"><strong>Age:</strong> {vaccine.age} years</p>
                                    <p className="text-lg"><strong>Date of Birth:</strong> {formatDate(vaccine.dob)}</p>
                                    <p className="text-lg"><strong>Scheduled Date:</strong> {formatDate(vaccine.sched_date)}</p>
                                    <p className="text-lg"><strong>Status:</strong> {getStatusLabel(vaccine.status)}</p>
                                    <p className="text-lg"><strong>Time:</strong> {vaccine.sched_time}</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button type="primary">View</Button>
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
                    <Form.Item
                        name="sched_date"
                        label="Schedule Date"
                        rules={[{ required: true, message: 'Please select the scheduled date!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item
                        name="sched_time"
                        label="Schedule Time"
                        rules={[{ required: true, message: 'Please select the scheduled time!' }]}
                    >
                        <Input type="time" />
                    </Form.Item>
                    <Form.Item
                        name="vaccine_id"
                        label="Vaccine"
                        rules={[{ required: true, message: 'Please select a vaccine!' }]}
                    >
                        <Select placeholder="Select Vaccine">
                            {vaccines.map((vaccine) => (
                                <Option key={vaccine.id} value={vaccine.id}>
                                    {vaccine.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="worker_id"
                        label="Health Worker"
                        rules={[{ required: true, message: 'Please select a health worker!' }]}
                    >
                        <Select placeholder="Select Health Worker">
                            {healthWorkers.map((worker) => (
                                <Option key={worker.hworker_id} value={worker.hworker_id}>
                                    {worker.fname} {worker.lname}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="member_id"
                        label="Infant"
                        rules={[{ required: true, message: 'Please select a member!' }]}
                    >
                        <Select placeholder="Select Member">
                            {members.map((member) => (
                                <Option key={member.id} value={member.id}>
                                    {member.fname}, {member.lname} {member.suffix}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Vaccination;
