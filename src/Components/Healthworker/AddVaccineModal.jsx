import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Switch, InputNumber, message, Select } from 'antd';
import axiosInstance from '../../../api/axiosConfig';

const { Option } = Select;

const AddVaccineModal = ({ visible, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);

    const handleAddVaccine = async (values) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/vaccine/create', {
                name: values.name,
                dosage_info: values.dosage_info,
                expiry: values.expiry.format('YYYY-MM-DD'),
                status: values.status,
                available: values.available,
            });
            message.success(response.data.message);
            onAdd(); // Refresh the vaccine list
            onClose();
        } catch (error) {
            console.error(error);
            message.error('Failed to add vaccine');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Vaccine"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical" onFinish={handleAddVaccine}>
    
                <Form.Item label="Vaccine Name" name="name" rules={[{ required: true, message: 'Please enter the vaccine name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Dosage Info" name="dosage_info" rules={[{ required: true, message: 'Please enter dosage info' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Expiry Date" name="expiry" rules={[{ required: true, message: 'Please select the expiry date' }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Status" name="status" valuePropName="checked">
                    <Switch checkedChildren="Available" unCheckedChildren="Unavailable" />
                </Form.Item>
                <Form.Item label="Available Quantity" name="available" rules={[{ required: true, message: 'Please enter available quantity' }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Add Vaccine
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddVaccineModal;