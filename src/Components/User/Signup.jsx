import React, { useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import Navigation from "../Nav/Navigation";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fname: '',
    mname: '',
    lname: '',
    suffix: '',
    address: '',
    mobile: '',
    age: '',
    dob: '',
    prof_info: '',
    licensenum: '',
    job_title: '',
    department: '',
    experience: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
        const response = await axiosInstance.post('/api/auth/signup', formData);
        setMessage(response.data.message);

        // Navigate directly to the success page
        navigate('/success');
    } catch (err) {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
};

  return (
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl p-8 bg-white rounded shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">Health Worker Sign Up</h2>

          {message && (
            <div className="p-4 mb-4 text-green-600 bg-green-100 border border-green-400 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'First Name', name: 'fname' },
                { label: 'Middle Name', name: 'mname' },
                { label: 'Last Name', name: 'lname' },
                { label: 'Suffix', name: 'suffix' }
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Address', name: 'address' },
                { label: 'Mobile', name: 'mobile', type: 'tel' },
                { label: 'Age', name: 'age', type: 'number' },
                { label: 'Date of Birth', name: 'dob', type: 'date' }
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Professional Info', name: 'prof_info' },
                { label: 'License Number', name: 'licensenum' },
                { label: 'Job Title', name: 'job_title' },
                { label: 'Department', name: 'department' },
                { label: 'Years of Experience', name: 'experience', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Password', name: 'password', type: 'password' }
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
