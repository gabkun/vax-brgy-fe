import React from "react";
import { Modal, Input, Form, message, Select, Switch } from "antd";

const { Option } = Select;

const AddVaccineModal = ({
    visible,
    onClose,
    onAdd,
    onUpdate,
    editingVaccineId,
    type,
    setType,
    name,
    setName,
    dosageInfo,
    setDosageInfo,
    expiry,
    setExpiry,
    contra,
    setContra,
    status,
    setStatus,
    available,
    setAvailable,
}) => {
    const handleSubmit = () => {
        if (!name || !type || !expiry) {
            message.error("Please fill in all required fields.");
            return;
        }

        if (editingVaccineId) {
            onUpdate();  // Call update function if editing
        } else {
            onAdd();  // Call add function if not editing
        }

        onClose();
    };

    return (
        <Modal
            title={editingVaccineId ? "Update Vaccine" : "Add Vaccine"}
            visible={visible}
            onCancel={onClose}
            onOk={handleSubmit}
            okText={editingVaccineId ? "Update" : "Add"}
            cancelText="Cancel"
        >
            <Form layout="vertical">
                <Form.Item
                    label="Vaccine Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select the vaccine type' }]}
                >
                    <Select
                        placeholder="Select vaccine type"
                        value={type}
                        onChange={(value) => setType(value)}
                    >
                        <Option value="Inactivated">Inactivated Vaccines</Option>
                        <Option value="Live Attenuated">Live Attenuated Vaccines</Option>
                        <Option value="Subunit, Recombinant, Polysaccharide, Conjugate">
                            Subunit, Recombinant, Polysaccharide, and Conjugate Vaccines
                        </Option>
                        <Option value="mRNA">mRNA Vaccines</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Vaccine Name">
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                <Form.Item label="Dosage Info">
                    <Input value={dosageInfo} onChange={(e) => setDosageInfo(e.target.value)} />
                </Form.Item>
                <Form.Item label="Expiry Date">
                    <Input
                        type="date"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Contraindications">
                    <Input value={contra} onChange={(e) => setContra(e.target.value)} />
                </Form.Item>
                <Form.Item label="Status" name="status" valuePropName="checked">
                    <Switch
                        checked={status}
                        checkedChildren="Available"
                        unCheckedChildren="Unavailable"
                        onChange={(checked) => setStatus(checked)}
                    />
                </Form.Item>
                <Form.Item label="Available Quantity">
                    <Input
                        type="number"
                        value={available}
                        onChange={(e) => setAvailable(e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddVaccineModal;