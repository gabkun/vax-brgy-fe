import React, { useState } from 'react';
import { Calendar, Modal, Button } from 'antd';

const CalendarModal = ({ dateCellRender, handleDateClick }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Open Calendar
            </Button>
            <Modal
                title="Vaccination Calendar"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={1000}
            >
                <Calendar 
                    dateCellRender={dateCellRender} 
                    className="bg-white p-4 shadow-lg rounded-lg mb-6" 
                    onSelect={handleDateClick} 
                />
            </Modal>
        </>
    );
};

export default CalendarModal;