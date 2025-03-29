import React from 'react';
import Navigation from '../Nav/Navigation';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center h-96 bg-gradient-to-r from-green-400 to-blue-500 text-white text-center px-6">
        <h1 className="text-4xl font-bold">Barangay Canlandog Vaccination System</h1>
        <p className="mt-4 text-lg">Ensuring a healthier community through efficient vaccination management.</p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200">Get Vaccinated</button>
      </header>

      {/* About Section */}
      <section className="py-12 px-6 text-center bg-white">
        <h2 className="text-3xl font-semibold text-gray-800">About the Vaccination System</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          The Barangay Canlandog Vaccination System streamlines the vaccination process, ensuring an organized and accessible way for residents to receive their immunizations. Our goal is to improve community health and prevent disease outbreaks.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Key Features</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-600">Online Registration</h3>
            <p className="mt-2 text-gray-600">Easily schedule your vaccination appointment online.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">Real-time Updates</h3>
            <p className="mt-2 text-gray-600">Stay informed about available vaccines and schedules.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Secure Records</h3>
            <p className="mt-2 text-gray-600">Keep track of your vaccination history with ease.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Our Impact</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-4xl font-bold text-green-600">10,000+</div>
          <p className="text-gray-600">Residents Vaccinated</p>
          <div className="text-4xl font-bold text-blue-600">95%</div>
          <p className="text-gray-600">Vaccination Coverage</p>
          <div className="text-4xl font-bold text-red-600">50+</div>
          <p className="text-gray-600">Healthcare Professionals</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Frequently Asked Questions</h2>
        <div className="mt-6 text-left max-w-3xl mx-auto">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Who can get vaccinated?</h3>
            <p className="text-gray-600">All residents of Barangay Canlandog are eligible for free vaccination.</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">How do I book an appointment?</h3>
            <p className="text-gray-600">You can register online through our system or visit the barangay health center.</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Are vaccines safe?</h3>
            <p className="text-gray-600">Yes, all vaccines provided are approved by the Department of Health.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Get in Touch</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          For inquiries and assistance, contact us at:
        </p>
        <p className="mt-2 text-lg font-semibold text-blue-600">barangaycanlandog.vax@gmail.com</p>
        <p className="text-lg font-semibold text-blue-600">(123) 456-7890</p>
      </section>

      <footer className="py-6 bg-gray-900 text-white text-center">
        <p>&copy; 2025 Barangay Canlandog Vaccination System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;