import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Avatar, Layout, DatePicker  } from 'antd';
import moment from 'moment';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../Sidebar/Sidebar';

const { Sider, Content, Header } = Layout;

const Infant = () => {
    const [infants, setInfants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lname, setLname] = useState('');
    const [fname, setFname] = useState('');
    const [mname, setMname] = useState('');
    const [suffix, setSuffix] = useState('');
    const [age, setAge] = useState('');
    const [dob, setDob] = useState('');
    const [purok, setPurok] = useState('');
    const [documents, setDocuments] = useState('');
    const [nameParent, setNameParent] = useState('');
    const [puroks, setPuroks] = useState([]);

const fetchPuroks = async () => {
    try {
        const response = await axiosInstance.get('/api/purok/');
        setPuroks(response.data.puroks || []);
    } catch (error) {
        message.error('Failed to fetch puroks');
    }
};

useEffect(() => {
    fetchInfants();
    fetchPuroks();  // Fetch puroks when the component loads
}, []);

    const fetchInfants = async () => {
        try {
            const response = await axiosInstance.get('/api/infant/');
            console.log('Infants response:', response.data);
            setInfants(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            message.error('Failed to fetch infants');
        }
    };

    const handleCreate = async () => {
        try {
            const formData = new FormData();
            formData.append('lname', lname);
            formData.append('fname', fname);
            formData.append('mname', mname);
            formData.append('suffix', suffix);
            formData.append('age', age);
            formData.append('dob', dob);
            formData.append('purok', purok);
            formData.append('documents', documents); // Attach the file
            formData.append('name_parent', nameParent);
    
            await axiosInstance.post('/api/infant/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            message.success('Infant added successfully');
            fetchInfants();
            setLname('');
            setFname('');
            setMname('');
            setSuffix('');
            setAge('');
            setDob('');
            setPurok('');
            setDocuments('');
            setNameParent('');
            setIsModalOpen(false);
        } catch (error) {
            message.error('Failed to add infant');
        }
    };

    useEffect(() => {
        fetchInfants();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Infants List</h2>
                    <Avatar size="large" className="bg-gray-300" />
                </Header>
                <Content className="p-6 bg-gray-100">
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Add Infant</Button>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        {infants.map((infant) => (
                            <Card key={infant.id} className="shadow-lg p-4">
                                <h3 className="text-lg font-bold">{infant.lname}, {infant.fname} {infant.mname} {infant.suffix}</h3>
                                <p>Age: {infant.age} Years Old</p>
                                <p>Date of Birth:{formatDate(infant.dob)}</p>
                                <p>Purok: {infant.purok_name}</p>
                                <p>Documents: {infant.documents}</p>
                                <p>Parent's Name: {infant.name_parent}</p>
                                <div className="flex justify-end space-x-2 mt-2">
                                    <Button 
                                        type="primary" 
                                        onClick={() => handleView(infant)}
                                        className="bg-blue-500 text-white"
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        onClick={() => handleEdit(infant)}
                                        className="bg-green-500 text-white "
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Modal title="Add Infant" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleCreate}>
    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Last Name</label>
        <Input placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} />
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">First Name</label>
        <Input placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} />
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Middle Name</label>
        <Input placeholder="Middle Name" value={mname} onChange={(e) => setMname(e.target.value)} />
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Suffix</label>
        <select
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
        >
            <option value="">None</option>
            <option value="Jr">Jr.</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
        </select>
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Age</label>
        <Input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Date of Birth</label>
        <DatePicker
            placeholder="Date of Birth"
            value={dob ? moment(dob, 'YYYY-MM-DD') : null}
            onChange={(date, dateString) => setDob(dateString)}
            format="YYYY-MM-DD"
            className="w-full"
        />
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Purok</label>
        <select
            value={purok}
            onChange={(e) => setPurok(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
        >
            <option value="" disabled>Select Purok</option>
            {puroks.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
            ))}
        </select>
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Birth Certificate</label>
        <input
            type="file"
            onChange={(e) => setDocuments(e.target.files[0])}
            className="block w-full p-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
    </div>

    <div className="mb-2">
        <label className="block text-gray-700 mb-1">Parent's Name</label>
        <Input placeholder="Parent's Name" value={nameParent} onChange={(e) => setNameParent(e.target.value)} />
    </div>
</Modal>

                </Content>
            </Layout>
        </Layout>
    );
};

export default Infant;
