import React from 'react';
import Navigation from '../Nav/Navigation';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navigation />
      <header className="flex items-center justify-center h-96 bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to VaxBarangay</h2>
          <p className="text-lg">Empowering sustainability through technology</p>
        </div>
      </header>
    </div>
  );
};

export default Homepage;
