import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Card, Avatar, Modal, message } from 'antd';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../Sidebar/Sidebar';
import background from '../../img/bg-image-admin.jpg'

const { Sider, Content, Header } = Layout;

const PurokManagement = () => {
    const [name, setName] = useState('');
    const [puroks, setPuroks] = useState([]);
    const [inactivePuroks, setInactivePuroks] = useState([]);
    const [editingPurok, setEditingPurok] = useState(null);
    const [editName, setEditName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

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


    const handleUpdatePurok = async () => {
        if (!editName) {
            alert('Name is required');
            return;
        }
        try {
            await axiosInstance.put(`/api/purok/${editingPurok.id}`, { name: editName });
            message.success('Purok updated successfully');
            setIsModalVisible(false);
            fetchPuroks();
        } catch (error) {
            console.error('Error updating purok:', error);
            message.error('Failed to update purok');
        }
    };

    const handleDeletePurok = async (id) => {
        try {
            await axiosInstance.delete(`/api/purok/${id}`);
            message.success('Purok deleted successfully');
            fetchPuroks();
        } catch (error) {
            console.error('Error deleting purok:', error);
            message.error('Failed to delete purok');
        }
    };

    const showEditModal = (purok) => {
        setEditingPurok(purok);
        setEditName(purok.name);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
<Layout className="min-h-screen">
    <Sidebar />
    <Layout>
        <Header className="bg-white p-4 shadow-md flex justify-between items-center">
            <h2 className="text-4xl font-semibold">Purok Management</h2>
            <Avatar size="large" className="bg-gray-300" />
        </Header>
        <Content
            className="p-6 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
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
                <Card title="Puroks List" bordered={true}>
                    {puroks.map((purok) => (
                        <div key={purok.id} className="flex justify-between items-center mb-2">
                            <p>{purok.name}</p>
                            <div>
                                            <Button 
                                            type="primary" 
                                            style={{ marginRight: '5px' }} 
                                            onClick={() => showEditModal(purok)}
                                        >
                                            Update
                                        </Button>
                                        <Button 
                                            danger 
                                            onClick={() => handleDeletePurok(purok.id)}
                                        >
                                            Delete
                                        </Button>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
            <Modal
                        title="Edit Purok"
                        visible={isModalVisible}
                        onOk={handleUpdatePurok}
                        onCancel={handleCancel}
                    >
                        <Input
                            placeholder="Enter New Purok Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </Modal>
        </Content>
    </Layout>
</Layout>

    );
};

export default PurokManagement;
