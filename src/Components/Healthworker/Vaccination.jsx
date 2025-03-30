import React, { useState, useEffect } from 'react';
import { Card, Spin, Layout, message, Button, Modal, Form, Input, Select, Tag, Calendar, Badge, List } from 'antd';
import dayjs from "dayjs";
import Sidebar from './Sidebar';
import axiosInstance from '../../../api/axiosConfig';
import background from '../../img/bg-image-admin.jpg';
import EditVaccination from './EditModal';

const { Sider, Content, Header } = Layout;
const { Option } = Select;

const HealthVaccination = () => {
    const [vaccinations, setVaccinations] = useState([]);
    const [healthWorkers, setHealthWorkers] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [contact, setContact] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isSchedModalOpen, setIsSchedModalOpen] = useState(false);
    const [selectedVaccinationId, setSelectedVaccinationId] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [form] = Form.useForm();

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ vaccineRes, workerRes] = await Promise.all([
                    axiosInstance.get('/api/vaccine/'),
                    axiosInstance.get('/api/health/approved'),
                ]);
                setVaccines(Array.isArray(vaccineRes.data) ? vaccineRes.data : []);
                setHealthWorkers(Array.isArray(workerRes.data) ? workerRes.data : []);
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

    const deleteVaccination = async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/vaccination/${id}`);
            console.log(id)
            if (response.status === 200) {
                alert('Vaccination record deleted successfully');
                navigate(0)
                // You can add logic to update the state or refresh the list here
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete vaccination record');
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
    

    const handleEditClick = (id) => {
        setSelectedVaccinationId(id);
        setIsEditOpen(true);
        console.log("Edit button clicked, ID:", id); // For debugging
    };

    // Table columns
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Scheduled Date', dataIndex: 'sched_date', key: 'sched_date' },
        { title: 'Scheduled Time', dataIndex: 'sched_time', key: 'sched_time' },
        { title: 'Vaccine ID', dataIndex: 'vaccine_id', key: 'vaccine_id' },
        { title: 'Worker ID', dataIndex: 'worker_id', key: 'worker_id' },
        { title: 'Member ID', dataIndex: 'member_id', key: 'member_id' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button onClick={() => handleEditClick(record.id)}>Edit</Button>
            ),
        },
    ];

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
                worker: `${vaccine.worker_fname} ${vaccine.worker_lname}`, // Include worker name
            }));
    };

    // Render Vaccinations in Calendar Cell
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

    // Handle Date Click (Show List in Modal)
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsSchedModalOpen(true);
    };

    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
            <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                <h2 className="text-4xl font-semibold">Vaccination History</h2>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
    Add Vaccination
</Button>
            </Header>

            <Content className="p-6 bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold my-4">Vaccination Schedule</h2>
                        <Calendar 
                            dateCellRender={dateCellRender} 
                            className="bg-white p-4 shadow-lg rounded-lg mb-6" 
                            onSelect={handleDateClick} 
                        />

                        <h2 className="text-3xl font-bold my-4">Vaccination Records</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vaccinations.map((vaccine) => (
                                <Card key={vaccine.id} className="shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {vaccine.member_lname}, {vaccine.member_fname} {vaccine.suffix}
                                    </h3>
                                    <p className="text-lg"><strong>Scheduled Date:</strong> {dayjs(vaccine.sched_date).format("MM/DD/YYYY")}</p>
                                    <p className="text-lg"><strong>Vaccine:</strong> {vaccine.vaccine_name}</p>
                                    <p className="text-lg"><strong>Status:</strong> {getStatusLabel(vaccine.status)}</p>
                                    <p className="text-lg"><strong>Time:</strong> {vaccine.sched_time}</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button type="primary" onClick={() => handleViewVaccination(vaccine.id)}>View</Button>
                                        <Button type="primary" onClick={() => handleEditClick(vaccine.id)}>Edit</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </Content>

            {/* Modal to Show Individuals Scheduled on Selected Date */}
            <Modal
                title={`Vaccinations on ${selectedDate ? selectedDate.format("MM/DD/YYYY") : ""}`}
                open={isSchedModalOpen}
                onCancel={() => setIsSchedModalOpen(false)}
                footer={null}
            >
                <List
                    bordered
                    dataSource={getListData(selectedDate || dayjs())}
                    renderItem={(item) => (
                        <div>
                        <List.Item>
                            <strong>{item.member}</strong> - {item.vaccine}
                        </List.Item>
                        <List.Item>
                            <strong>Health Worker Assigned: </strong> {item.worker}
                        </List.Item>
                        </div>
                        

                    )}
                />
            </Modal>
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
        <Form.Item
            name="contact_number"
            label="Contact Number"
            rules={[
                { required: true, message: 'Please enter the contact number!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Please enter a valid contact number!' }
            ]}
        >
            <Input placeholder="Enter contact number" />
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
            <Button danger type="default" onClick={() => deleteVaccination(viewData.id)}>Delete</Button>
        </>
    )}
</Modal>
<EditVaccination
    isModalOpen={isEditOpen}
    setIsModalOpen={setIsEditOpen}
    vaccinationId={selectedVaccinationId}  // Pass the ID correctly
    vaccines={vaccines}
    contact={contact}
    healthWorkers={healthWorkers}
    members={members}
    refreshData={() => fetchData()}
/>


        </Layout>
    );
};

export default HealthVaccination;