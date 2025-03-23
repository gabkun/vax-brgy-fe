import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axiosInstance from '../../../api/axiosConfig';

const { Option } = Select;

const EditVaccination = ({ isModalOpen, setIsModalOpen, vaccinationId, vaccines, healthWorkers, members, refreshData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (vaccinationId) {
            axiosInstance.get(`/api/vaccination/${vaccinationId}`)
                .then((response) => {
                    form.setFieldsValue(response.data);
                })
                .catch((error) => {
                    console.error(error);
                    message.error('Failed to load vaccination data');
                });
        }
    }, [vaccinationId, form]);

    const handleEditVaccination = async (values) => {
        try {
            await axiosInstance.put(`/api/vaccination/${vaccinationId}`, values);
            message.success('Vaccination record updated successfully');
            setIsModalOpen(false);
            refreshData();
        } catch (error) {
            console.error(error);
            message.error('Failed to update vaccination record');
        }
    };

    return (
        <Modal
            title="Edit Vaccination"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
        >
            <Form form={form} onFinish={handleEditVaccination} layout="vertical">
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
    );
};

export default EditVaccination;
