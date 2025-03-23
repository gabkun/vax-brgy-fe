import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Modal } from 'antd';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../Sidebar/Sidebar';
import background from '../../img/bg-image-admin.jpg';

const HealthWorkerManagement = () => {
    const [approvedWorkers, setApprovedWorkers] = useState([]);
    const [pendingWorkers, setPendingWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchApprovedWorkers();
        fetchPendingWorkers();
    }, []);

    const fetchApprovedWorkers = async () => {
        try {
            const response = await axiosInstance.get('api/health/approved');
            setApprovedWorkers(response.data);
        } catch (error) {
            console.error('Error fetching approved workers:', error);
        }
    };

    const fetchPendingWorkers = async () => {
        try {
            const response = await axiosInstance.get('api/health/pending');
            setPendingWorkers(response.data);
        } catch (error) {
            console.error('Error fetching pending workers:', error);
        }
    };

    const approveWorker = async (id) => {
        try {
            await axiosInstance.put(`api/health/approve/${id}`);
            fetchPendingWorkers();
            fetchApprovedWorkers();
        } catch (error) {
            console.error('Error approving worker:', error);
        }
    };

    const viewWorker = async (id) => {
        try {
            const response = await axiosInstance.get(`api/health/${id}`);
            setSelectedWorker(response.data);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error fetching health worker details:', error);
        }
    };

    const declineWorker = async (id) => {
        try {
            await axiosInstance.put(`api/health/decline/${id}`);
            fetchPendingWorkers();
        } catch (error) {
            console.error('Error declining worker:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedWorker(null);
    };

    const approvedColumns = [
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Name', key: 'name', render: (_, worker) => `${worker.fname} ${worker.mname} ${worker.lname} ${worker.suffix}` },
        { title: 'Profession', dataIndex: 'prof_info', key: 'prof_info' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, worker) => (
                <>
                    <Button type="primary" onClick={() => viewWorker(worker.id)} className="mr-2 bg-blue-500 text-white">View</Button>
                    <Button className="bg-green-500 text-white">Edit</Button>
                </>
            ),
        },
    ];

    const pendingColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Name', key: 'name', render: (_, worker) => `${worker.fname} ${worker.mname} ${worker.lname} ${worker.suffix}` },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, worker) => (
                <>
                    <Button type="primary" onClick={() => approveWorker(worker.id)} className="mr-2 bg-green-500 text-white">Approve</Button>
                    <Button danger onClick={() => declineWorker(worker.id)} className="bg-red-500 text-red-500">Decline</Button>
                </>
            ),
        },
    ];

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Health Workers Management</h2>
                <Card className="mb-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Approved Health Workers</h3>
                    <Table columns={approvedColumns} dataSource={approvedWorkers} rowKey="id" />
                </Card>
                <Card className="shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Pending Health Workers</h3>
                    <Table columns={pendingColumns} dataSource={pendingWorkers} rowKey="id" />
                </Card>

                <Modal
                    title="Health Worker Details"
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button danger key="close" onClick={handleCloseModal}>
                            Close
                        </Button>,
                    ]}
                >
                    {selectedWorker && (
                        <div>
                            <p><strong>Email:</strong> {selectedWorker.email}</p>
                            <p><strong>Name:</strong> {selectedWorker.fname} {selectedWorker.mname} {selectedWorker.lname} {selectedWorker.suffix}</p>
                            <p><strong>Address:</strong> {selectedWorker.address}</p>
                            <p><strong>Mobile:</strong> {selectedWorker.mobile}</p>
                            <p><strong>Age:</strong> {selectedWorker.age}</p>
                            <p><strong>Date of Birth:</strong> {selectedWorker.dob}</p>
                            <p><strong>Profession:</strong> {selectedWorker.prof_info}</p>
                            <p><strong>License Number:</strong> {selectedWorker.licensenum}</p>
                            <p><strong>Job Title:</strong> {selectedWorker.job_title}</p>
                            <p><strong>Department:</strong> {selectedWorker.department}</p>
                            <p><strong>Experience:</strong> {selectedWorker.experience}</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default HealthWorkerManagement;
