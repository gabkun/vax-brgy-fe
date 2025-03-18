import React, { useEffect, useState } from 'react';
import { Table, Button, Card } from 'antd';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../Sidebar/Sidebar';
import background from '../../img/bg-image-admin.jpg'

const HealthWorkerManagement = () => {
    const [approvedWorkers, setApprovedWorkers] = useState([]);
    const [pendingWorkers, setPendingWorkers] = useState([]);

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

    const declineWorker = async (id) => {
        try {
            await axiosInstance.put(`api/health/decline/${id}`);
            fetchPendingWorkers();
        } catch (error) {
            console.error('Error declining worker:', error);
        }
    };

    const approvedColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Name', key: 'name', render: (_, worker) => `${worker.fname} ${worker.mname} ${worker.lname} ${worker.suffix}` },
        { title: 'Job Title', dataIndex: 'job_title', key: 'job_title' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
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
            </div>
        </div>
    );
};

export default HealthWorkerManagement;
