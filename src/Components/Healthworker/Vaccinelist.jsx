import React, { useState, useEffect } from "react";
import { Card, Avatar, Spin, Layout, message, Button } from "antd";
import Sidebar from "./Sidebar";
import axiosInstance from "../../../api/axiosConfig";
import AddVaccineModal from "./AddVaccineModal.jsx";
import background from '../../img/bg-image-work.jpg'
import { useNavigate } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

const HealthVaccine = () => {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

        const [editingVaccineId, setEditingVaccineId] = useState(null);
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [dosageInfo, setDosageInfo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [contra, setContra] = useState('');
    const [status, setStatus] = useState('');
    const [available, setAvailable] = useState('');

    const navigate = useNavigate();

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

    const handleUpdate = async (id) => {
        try {
            const response = await axiosInstance.get(`/api/vaccine/${id}`);
            const data = response.data;
    
            setType(data.type);
            setName(data.name);
            setDosageInfo(data.dosage_info);
            setExpiry(data.expiry);
            setContra(data.contra);
            setStatus(data.status);
            setAvailable(data.available);
            setEditingVaccineId(id);
            setModalVisible(true);  // Open the modal with update mode
        } catch (error) {
            message.error("Failed to fetch vaccine details");
        }
    };
    
    const handleCreateOrUpdate = async () => {
        try {
            const vaccineData = {
                type,
                name,
                dosage_info: dosageInfo,
                expiry,
                contra,
                status,
                available,
            };
    
            const apiUrl = editingVaccineId ? `/api/vaccine/vaccines/${editingVaccineId}` : '/api/vaccine/create';
            const method = editingVaccineId ? 'put' : 'post';
    
            await axiosInstance[method](apiUrl, vaccineData);
            message.success(editingVaccineId ? "Vaccine updated successfully" : "Vaccine added successfully");
            fetchVaccines();
            setModalVisible(false);
            setEditingVaccineId(null);  // Reset after update
        } catch (error) {
            message.error(editingVaccineId ? "Failed to update vaccine" : "Failed to add vaccine");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/vaccine/vaccines/${id}`);
            message.success('Vaccine deleted successfully');
            fetchVaccines(); // Refresh the vaccine list after deletion
        } catch (error) {
            if (error.response?.status === 500) { // Check for conflict error
                message.error('Cannot delete vaccine because it is in use.');
            } else {
                message.error('Vaccine Is in use, Cannot delete');
            }
        }
    };
    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-4xl font-semibold">Vaccine List</h2>
                    <Button type="primary" onClick={() => setModalVisible(true)}>
                        Add Vaccine
                    </Button>
                    <Avatar size="large" className="bg-gray-300" />
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
                                    <span
                                        className={`font-semibold ${
                                            vaccine.status ? "text-green-500" : "text-red-500"
                                        }`}
                                    >
                                        {vaccine.status ? "Available" : "Unavailable"}
                                    </span>
                                }
                            >
                                <p>
                                    <strong>Type:</strong> {vaccine.type}
                                </p>
                                <p>
                                    <strong>Dosage Info:</strong> {vaccine.dosage_info}
                                </p>
                                <p>
                                    <strong>Expiry:</strong> {new Date(vaccine.expiry).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Available:</strong> {vaccine.available} pcs
                                </p>
                                <p>
                                    <strong>Contraindications:</strong> {vaccine.contra}
                                </p>
                                <div className="flex justify-end gap-2 mt-4">
                                <Button
    type="primary"
    onClick={() => handleUpdate(vaccine.id)}
    className="bg-blue-500 text-white"
>
    Update
</Button>
<Button
    danger
    onClick={() => handleDelete(vaccine.id)}
    
>
    Delete
</Button>
                                </div>
                            </Card>
                            ))}
                        </div>
                    )}
                    <AddVaccineModal
    visible={modalVisible}
    onClose={() => setModalVisible(false)}
    onAdd={handleCreateOrUpdate}
    onUpdate={handleCreateOrUpdate}
    editingVaccineId={editingVaccineId}
    type={type}
    setType={setType}
    name={name}
    setName={setName}
    dosageInfo={dosageInfo}
    setDosageInfo={setDosageInfo}
    expiry={expiry}
    setExpiry={setExpiry}
    contra={contra}
    setContra={setContra}
    status={status}
    setStatus={setStatus}
    available={available}
    setAvailable={setAvailable}
/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default HealthVaccine;