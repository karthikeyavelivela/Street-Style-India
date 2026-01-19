import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import Dashboard from './Dashboard';
import Products from './Products';

const Orders = () => <div className="p-8 bg-white rounded-xl border border-gray-100 text-center text-gray-400 font-bold">Orders Management Module</div>
const UsersPage = () => <div className="p-8 bg-white rounded-xl border border-gray-100 text-center text-gray-400 font-bold">Users Management Module</div>

const Admin = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-black tracking-tighter">SSI ADMIN</h1>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button className="flex items-center space-x-3 text-red-600 font-bold px-4 py-2 hover:bg-red-50 w-full rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-black">
                        {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-gray-500">Admin User</span>
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </div>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </main>
        </div>
    );
};

export default Admin;
