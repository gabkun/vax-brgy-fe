import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Card, Avatar } from 'antd';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../Sidebar/Sidebar';

const { Sider, Content, Header } = Layout;

const PurokManagement = () => {
    const [name, setName] = useState('');
    const [puroks, setPuroks] = useState([]);
    const [inactivePuroks, setInactivePuroks] = useState([]);

    const fetchPuroks = async () => {
        try {
            const response = await axiosInstance.get('/api/purok/');
            setPuroks(response.data.puroks);
        } catch (error) {
            console.error('Error fetching active puroks:', error);
        }
    };

    const fetchInactivePuroks = async () => {
        try {
            const response = await axiosInstance.get('/api/purok/inactive');
            setInactivePuroks(response.data.puroks);
        } catch (error) {
            console.error('Error fetching inactive puroks:', error);
        }
    };

    const handleCreatePurok = async () => {
        if (!name) {
            alert('Name is required');
            return;
        }
        try {
            await axiosInstance.post('/api/purok/create', { name });
            setName('');
            fetchPuroks();
        } catch (error) {
            console.error('Error creating purok:', error);
        }
    };

    useEffect(() => {
        fetchPuroks();
        fetchInactivePuroks();
    }, []);

    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Purok Management</h2>
                    <Avatar size="large" className="bg-gray-300" />
                </Header>
                <Content className="p-6 bg-gray-100">
                    <div className="mb-4">
                        <Input
                            placeholder="Enter Purok Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '300px', marginRight: '10px' }}
                        />
                        <Button type="primary" onClick={handleCreatePurok}>Create Purok</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Card title="Active Puroks" bordered={true}>
                            {puroks.map((purok) => (
                                <p key={purok.id}>{purok.name}</p>
                            ))}
                        </Card>
                        <Card title="Inactive Puroks" bordered={true}>
                            {inactivePuroks.map((purok) => (
                                <p key={purok.id}>{purok.name}</p>
                            ))}
                        </Card>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default PurokManagement;
