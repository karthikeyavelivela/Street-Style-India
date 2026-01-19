import React, { useState } from 'react';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { logout, user } = useAuth(); // Assuming user is needed or just context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container mx-auto px-4 md:px-8 py-8">
            <h1 className="text-3xl font-black mb-8">MY ACCOUNT</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-medium overflow-hidden">
                        {[
                            { id: 'profile', label: 'My Profile', icon: User },
                            { id: 'orders', label: 'My Orders', icon: Package },
                            { id: 'wishlist', label: 'Wishlist', icon: Heart },
                            { id: 'addresses', label: 'Addresses', icon: MapPin },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition-colors ${activeTab === item.id
                                        ? 'bg-black text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-4 flex items-center space-x-3 text-red-600 hover:bg-red-50 border-t border-gray-100"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <div className="bg-white border border-gray-100 rounded-xl p-8">
                            <h2 className="text-xl font-bold mb-6">Profile Details</h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">First Name</label>
                                    <input type="text" defaultValue="Karthik" className="w-full border border-gray-300 rounded px-4 py-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Last Name</label>
                                    <input type="text" defaultValue="Velivela" className="w-full border border-gray-300 rounded px-4 py-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Email</label>
                                    <input type="email" defaultValue="karthik@example.com" className="w-full border border-gray-300 rounded px-4 py-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Phone</label>
                                    <input type="tel" defaultValue="+91 9876543210" className="w-full border border-gray-300 rounded px-4 py-3" />
                                </div>
                                <div className="col-span-2">
                                    <button className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {[1, 2].map((order) => (
                                <div key={order} className="bg-white border border-gray-100 rounded-xl p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">Order #SSI-829{order}</h3>
                                            <p className="text-sm text-gray-500">Placed on Jan 1{order}, 2026</p>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                            Delivered
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-sm text-gray-500">+1 more</div>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                        <span className="font-bold">Total: ₹3,499</span>
                                        <button className="text-primary font-bold text-sm hover:underline">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Reusing ProductCard for wishlist items */}
                            <ProductCard product={{
                                id: 101, name: "Wishlist Item 1", price: 1299, discount: 0,
                                image1: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=400"
                            }} />
                            <ProductCard product={{
                                id: 102, name: "Wishlist Item 2", price: 899, discount: 20,
                                image1: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400"
                            }} />
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-gray-200 rounded-xl p-6 relative">
                                <span className="absolute top-4 right-4 bg-gray-100 text-xs font-bold px-2 py-1 rounded">DEFAULT</span>
                                <h3 className="font-bold mb-2">Home</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Flat 402, Sunshine Apts<br />
                                    Indiranagar, 12th Main<br />
                                    Bangalore, KA 560038<br />
                                    +91 98765 43210
                                </p>
                                <div className="flex space-x-4 text-sm font-bold text-gray-500">
                                    <button className="hover:text-black">Edit</button>
                                    <button className="hover:text-red-600">Delete</button>
                                </div>
                            </div>
                            <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors min-h-[200px]">
                                <span className="text-4xl mb-2">+</span>
                                <span className="font-bold">Add New Address</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
