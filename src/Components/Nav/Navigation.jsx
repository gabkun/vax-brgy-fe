import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../../img/vaccine-logo.svg'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
        <img src={Logo} alt="Logo" className="h-16 w-16 md:h-20 md:w-20" />
        <h1 className="text-4xl font-bold">
          <a href="/" className="hover:underline">Barangay Canlandog Vaccination System</a>
        </h1>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <ul className={`md:flex space-x-6 ${isOpen ? 'block' : 'hidden'} md:block mt-3 md:mt-0`}> 

          <li>
            <a href="/login" className="text-blue-500 font-bold hover:text-blue-800">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
