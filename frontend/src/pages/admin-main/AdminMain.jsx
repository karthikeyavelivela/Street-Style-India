import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, DollarSign, LogOut, Menu, X, Warehouse, Search } from 'lucide-react';
import Dashboard from './Dashboard';
import Products from './Products';
import Employees from './Employees';
import Expenses from './Expenses';
import Sales from './Sales';

const AdminMain = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const stockAdminInfo = localStorage.getItem('stockAdminInfo');
        if (!stockAdminInfo) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('stockAdminInfo');
        navigate('/admin');
    };

    const navItems = [
        { path: '/admin-main', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin-main/products', icon: Package, label: 'Products' },
        { path: '/admin-main/employees', icon: Users, label: 'Employees' },
        { path: '/admin-main/expenses', icon: DollarSign, label: 'Expenses' },
        { path: '/admin-main/sales', icon: Warehouse, label: 'Offline Sales' },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tighter">STOCK ADMIN</h1>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                    <X size={24} />
                </button>
            </div>
            <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path);

                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-600 font-bold px-4 py-2 hover:bg-red-50 w-full rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-100 z-20 flex justify-between items-center p-4">
                <h1 className="text-xl font-black">STOCK ADMIN</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowSearch(!showSearch)}>
                        <Search size={20} />
                    </button>
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Global Search Bar (Mobile) */}
            {showSearch && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-100 z-19 p-4">
                    <input
                        type="text"
                        placeholder="Search products, employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            )}

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 bg-white border-r border-gray-200 fixed h-full z-10">
                <SidebarContent />
            </aside>

            {/* Sidebar (Mobile) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 animate-in slide-in-from-left">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0">
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-black">
                        {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    {/* Global Search (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products, employees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-64"
                            />
                        </div>
                    </div>
                </div>

                <Routes>
                    <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
                    <Route path="/products" element={<Products searchQuery={searchQuery} />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="*" element={<Dashboard searchQuery={searchQuery} />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminMain;




