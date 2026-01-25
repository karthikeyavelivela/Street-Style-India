import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'; // added useNavigate
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X, MessageSquare, Layout } from 'lucide-react'; // added Menu, X
import { useAuth } from '../../context/AuthContext'; // added useAuth
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
        </div>
    );
};

export default Admin;
