import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Avatar, Layout, DatePicker  } from 'antd';
import moment from 'moment';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../Sidebar/Sidebar';
import background from '../../img/bg-image-admin.jpg'
import { useNavigate } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

const HealthInfant = () => {
    const [infants, setInfants] = useState([]);
    const [editingInfant, setEditingInfant] = useState(null);
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
    const navigate = useNavigate()

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
            formData.append('documents', documents);
            formData.append('name_parent', nameParent);
    
            const apiUrl = editingInfant ? `/api/infant/infants/${editingInfant.id}` : '/api/infant/create';
            const method = editingInfant ? 'put' : 'post';
    
            await axiosInstance[method](apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            message.success(editingInfant ? 'Infant updated successfully' : 'Infant added successfully');
            fetchInfants();
            setIsModalOpen(false);
        } catch (error) {
            message.error(editingInfant ? 'Failed to update infant' : 'Failed to add infant');
        }
    };

    useEffect(() => {
        fetchInfants();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const reload = () => {
        navigate(0);
    }
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/infant/infants/${id}`);
            message.success('Infant record deleted successfully');
            navigate(0)
        } catch (error) {
            message.error('Failed to delete infant record');
        }
    };

    const handleView = async (infant) => {
        try {
            const response = await axiosInstance.get(`/api/infant/${infant.id}`);
            const data = response.data.data;
            
            // Display infant details using a modal
            Modal.info({
                title: 'Infant Details',
                content: (
                    <div>
                        <p>First Name: {data.fname}</p>
                        <p>Middle Name: {data.mname}</p>
                        <p>Last Name: {data.lname}</p>
                        <p>Suffix: {data.suffix}</p>
                        <p>Age: {data.age}</p>
                        <p>Date of Birth: {formatDate(data.dob)}</p>
                        <p>Purok: {data.purok_name}</p>
                        <p>Parent Name: {data.name_parent}</p>
                        {data.documents && (
                            <p>
                                Documents: <a href={`/uploads/${data.documents}`} target="_blank" rel="noopener noreferrer">View Document</a>
                            </p>
                        )}
                        <Button 
                        type="primary" 
                        danger 
                        onClick={() => handleDelete(infant.id)}
                        style={{ marginTop: '10px' }}
                    >
                        Delete
                    </Button>
                    </div>
                ),
                onOk() {},
            });
        } catch (error) {
            message.error('Failed to fetch infant details');
        }
    };
    
    const handleEdit = (infant) => {
        setEditingInfant(infant);
        setLname(infant.lname);
        setFname(infant.fname);
        setMname(infant.mname);
        setSuffix(infant.suffix);
        setAge(infant.age);
        setDob(moment(infant.dob));
        setPurok(infant.purok);
        setNameParent(infant.name_parent);
        setIsModalOpen(true);
    };
    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Infants List</h2>
                    <Avatar size="large" className="bg-gray-300" />
                </Header>
                <Content
                  className="p-6 bg-cover bg-center"
                  style={{ backgroundImage: `url(${background})` }}
                >
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Add Infant</Button>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        {infants.map((infant) => (
                            <Card key={infant.id} className="shadow-lg p-4">
                                <h3 className="text-lg font-bold">{infant.lname}, {infant.fname} {infant.mname} {infant.suffix}</h3>
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
                    <Modal title="Add Infant" visible={isModalOpen} onCancel={() => navigate(0)} onOk={handleCreate}>
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

export default HealthInfant;
