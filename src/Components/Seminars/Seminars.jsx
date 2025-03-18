import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';

const SeminarDashboard = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [viewSeminar, setviewSeminar] = useState(null);
  const [formSeminar, setFormSeminar] = useState({
    title: '',
    description: '',
    date: '',
    timeFrame: { from: '', to: '' },
    venue: '',
    speaker: { name: '', image: '', linkedin: '' },
    fee: '',
    slotsAvailable: '',
  });

  const fetchSeminars = async () => {
    try {
      const response = await axiosInstance.get('/api/seminars');
      setSeminars(response.data);
    } catch (err) {
      setError('Error fetching seminars');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeminarDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/seminars/${id}`);
      setSelectedSeminar(response.data);
      setFormSeminar(response.data); 
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError('Error fetching seminar details');
    }
  };

  const forView = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/seminars/${id}`);
      setviewSeminar(response.data);
      setFormSeminar(response.data); 
    } catch (err) {
      console.error(err);
      setError('Error fetching seminar details');
    }
  };


  useEffect(() => {
    fetchSeminars();
  }, []);

  const handleAddOrUpdateSeminar = async (e) => {
    e.preventDefault();
    try {
      if (selectedSeminar) {
        // Update existing seminar
        const response = await axiosInstance.put(`/api/seminars/${selectedSeminar._id}`, formSeminar, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSeminars(
          seminars.map((seminar) =>
            seminar._id === selectedSeminar._id ? response.data : seminar
          )
        );
      } else {
        // Add new seminar
        const response = await axiosInstance.post('/api/seminars', formSeminar, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSeminars([...seminars, response.data]);
      }
      setShowModal(false);
      setFormSeminar({
        title: '',
        description: '',
        date: '',
        timeFrame: { from: '', to: '' },
        venue: '',
        speaker: { name: '', image: '', linkedin: '' },
        fee: '',
        slotsAvailable: '',
      });
      setSelectedSeminar(null); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving seminar');
    }
  };

  const handleDeleteSeminar = async (seminarId) => {
    try {
      await axiosInstance.delete(`/api/seminars/${seminarId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSeminars(seminars.filter((seminar) => seminar._id !== seminarId));
      alert('Seminar deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting seminar');
    }
  };

  if (loading) return <div className="text-center py-10">Loading seminars...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Seminar Dashboard</h1>
        <button
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setShowModal(true);
            setSelectedSeminar(null); 
            setFormSeminar({
              title: '',
              description: '',
              date: '',
              timeFrame: { from: '', to: '' },
              venue: '',
              speaker: { name: '', image: '', linkedin: '' },
              fee: '',
              slotsAvailable: '',
            });
          }}
        >
          Add Seminar
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seminars.map((seminar) => (
            <div key={seminar._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{seminar.title}</h2>
              <p className="text-gray-600 mb-4">{seminar.description}</p>
              <p className="text-sm text-gray-500">Date: {new Date(seminar.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Venue: {seminar.venue}</p>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => fetchSeminarDetails(seminar._id)}
              >
                Update
              </button>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDeleteSeminar(seminar._id)}
              >
                Delete
              </button>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => forView(seminar._id)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedSeminar ? 'Update Seminar' : 'Add New Seminar'}</h2>
            <form onSubmit={handleAddOrUpdateSeminar}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formSeminar.title}
                  onChange={(e) => setFormSeminar({ ...formSeminar, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formSeminar.description}
                  onChange={(e) => setFormSeminar({ ...formSeminar, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formSeminar.date}
                  onChange={(e) => setFormSeminar({ ...formSeminar, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Time Frame</label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={formSeminar.timeFrame?.from || ''}
                    onChange={(e) =>
                      setFormSeminar({ ...formSeminar, timeFrame: { ...formSeminar.timeFrame, from: e.target.value } })
                    }
                    className="w-full px-4 py-2 border rounded"
                    required
                  />
                  <input
                    type="time"
                    value={formSeminar.timeFrame?.to || ''}
                    onChange={(e) =>
                      setFormSeminar({ ...formSeminar, timeFrame: { ...formSeminar.timeFrame, to: e.target.value } })
                    }
                    className="w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Venue</label>
                <input
                  type="text"
                  value={formSeminar.venue}
                  onChange={(e) => setFormSeminar({ ...formSeminar, venue: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Speaker</label>
                <input
                  type="text"
                  value={formSeminar.speaker?.name || ''}
                  onChange={(e) =>
                    setFormSeminar({
                      ...formSeminar,
                      speaker: { ...formSeminar.speaker, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Speaker Name"
                />
                <input
                  type="text"
                  value={formSeminar.speaker?.linkedin || ''}
                  onChange={(e) =>
                    setFormSeminar({
                      ...formSeminar,
                      speaker: { ...formSeminar.speaker, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded mt-2"
                  placeholder="Speaker LinkedIn"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Fee</label>
                <input
                  type="text"
                  value={formSeminar.fee}
                  onChange={(e) => setFormSeminar({ ...formSeminar, fee: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Slots Available</label>
                <input
                  type="number"
                  value={formSeminar.slotsAvailable}
                  onChange={(e) => setFormSeminar({ ...formSeminar, slotsAvailable: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {selectedSeminar ? 'Update' : 'Add'} Seminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewSeminar && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">{viewSeminar.title}</h2>
              <p>{viewSeminar.description}</p>
              <p>Date: {new Date(viewSeminar.date).toLocaleDateString()}</p>
              <p>Time: {viewSeminar.timeFrame?.from} - {viewSeminar.timeFrame?.to}</p>
              <p>Venue: {viewSeminar.venue}</p>
              <p>Speaker: {viewSeminar.speaker?.name}</p>
              <p>Fee: {viewSeminar.fee}</p>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setviewSeminar(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}


    </div>
  );
};

export default SeminarDashboard;