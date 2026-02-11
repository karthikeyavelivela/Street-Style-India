import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'; // added useNavigate
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X, MessageSquare, Layout, Warehouse } from 'lucide-react'; // added Menu, X
import { useAuth } from '../../context/AuthContext'; // added useAuth
import api from '../../utils/api';
import Dashboard from './Dashboard';
import Products from './Products';
import UsersPage from './Users'; // Changed from placeholder
import OrdersPage from './Orders'; // Changed from placeholder
import Reviews from './Reviews';
import Sections from './Sections';

const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showStockLogin, setShowStockLogin] = useState(false);
    const [stockPin, setStockPin] = useState(['', '', '', '', '', '']);
    const [stockLoginError, setStockLoginError] = useState('');

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null; // Will redirect via useEffect
    }

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
        { path: '/admin/sections', icon: Layout, label: 'Home Sections' },
        // { path: '/admin/settings', icon: Settings, label: 'Settings' }, 
    ];

    const handleStockClick = (e) => {
        e.preventDefault();
        setShowStockLogin(true);
        setStockPin(['', '', '', '', '', '']);
        setStockLoginError('');
    };

    const handlePinChange = (index, value) => {
        if (value.length > 1) return;
        const newPin = [...stockPin];
        newPin[index] = value;
        setStockPin(newPin);
        setStockLoginError('');

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handlePinKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !stockPin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleStockLogin = async () => {
        const pin = stockPin.join('');
        if (pin.length !== 6) {
            setStockLoginError('Please enter 6-digit PIN');
            return;
        }

        try {
            const { data } = await api.post('/admin-main/auth', { pin });
            // Store stock admin token separately
            localStorage.setItem('stockAdminInfo', JSON.stringify(data));
            // Redirect to admin-main
            window.location.href = '/admin-main';
        } catch (error) {
            setStockLoginError(error.response?.data?.message || 'Invalid PIN');
            setStockPin(['', '', '', '', '', '']);
            const firstInput = document.getElementById('pin-0');
            if (firstInput) firstInput.focus();
        }
    };

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tighter">SSI ADMIN</h1>
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
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                {/* Stock Admin Link */}
                <button
                    onClick={handleStockClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-600 hover:bg-gray-100"
                >
                    <Warehouse size={20} />
                    <span>Stock</span>
                </button>
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
                <h1 className="text-xl font-black">SSI ADMIN</h1>
                <button onClick={() => setSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>

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
                    <div className="flex items-center space-x-4">
                        <span className="hidden md:block text-sm font-bold text-gray-500">{user?.name || 'Admin'}</span>
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </div>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/sections" element={<Sections />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </main>

            {/* Stock Admin PIN Login Modal */}
            {showStockLogin && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Stock Admin Access</h2>
                            <button
                                onClick={() => {
                                    setShowStockLogin(false);
                                    setStockPin(['', '', '', '', '', '']);
                                    setStockLoginError('');
                                }}
                                className="text-gray-500 hover:text-black"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">Enter 6-digit Stock Admin PIN</p>

                        <div className="flex justify-center gap-3 mb-4">
                            {stockPin.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`pin-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value.replace(/\D/g, ''))}
                                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            ))}
                        </div>

                        {stockLoginError && (
                            <p className="text-red-600 text-sm text-center mb-4">{stockLoginError}</p>
                        )}

                        <button
                            onClick={handleStockLogin}
                            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                        >
                            Access Stock Panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
