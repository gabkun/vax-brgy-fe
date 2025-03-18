import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';

const VerificationCodeInput = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, verificationCode } = location.state || {};

    useEffect(() => {
        if (!userId || !verificationCode) {
            alert('Verification code or user ID not found. Please sign up again.');
            navigate('/signup');
        }
    }, [navigate, userId, verificationCode]);

    const handleChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                document.getElementById(`digit-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/verify-code', {
                user_id: userId,
                code: code.join('')
            });

            alert(response.data.message);
            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Verification Code</h2>
                <div className="flex justify-center gap-2 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`digit-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none transition duration-300"
                >
                    Verify
                </button>
            </div>
        </div>
    );
};

export default VerificationCodeInput;

