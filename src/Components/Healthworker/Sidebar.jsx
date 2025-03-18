import React from 'react';
import { Card, Button, Menu, Layout, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import Logo from '../../img/vaccine-logo.svg';
import { BarChart, Calendar, Baby, Syringe, Stethoscope, LogOut, House } from 'lucide-react';

const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider width={350} className="bg-gray-800 text-white">
            <div className="flex items-center justify-center p-6 space-x-3">
                <img src={Logo} alt="Logo" className="h-12 w-12" />
                <span className="text-3xl font-semibold">VaxBarangay</span>
            </div>
            <Menu theme="dark" mode="inline" className="text-xl mt-4">
                <Menu.Item key="1" icon={<BarChart />} className="text-white">
                    <Link to="/healthworker">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<Calendar />} className="text-white">
                    <Link to="/healthworker/vaccination">Vaccination History</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<Baby />} className="text-white">
                    <Link to="/healthworker/infant">Infant List</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<Syringe />} className="text-white">
                    <Link to="/healthworker/vaccinelist">Vaccine List</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<LogOut />} className="text-white">
                    <Link to="/logout">Logout</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
