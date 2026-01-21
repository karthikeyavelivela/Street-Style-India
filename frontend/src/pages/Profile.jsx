import React, { useEffect, useState } from 'react';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { logout, user, login } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        type: 'Home'
    });
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            fetchAddresses();
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && activeTab === 'orders') {
                setLoadingOrders(true);
                try {
                    const { data } = await api.get('/orders/my');
                    setOrders(data || []);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setOrders([]);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [user, activeTab]);

    const fetchAddresses = async () => {
        try {
            const { data: userData } = await api.get('/auth/profile');
            if (userData.addresses) {
                setAddresses(userData.addresses);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            // Addresses will be stored in localStorage as fallback
            const savedAddresses = localStorage.getItem('userAddresses');
            if (savedAddresses) {
                setAddresses(JSON.parse(savedAddresses));
            }
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/profile', profileData);
            toast.success('Profile updated successfully');
            // Refresh user data
            const { data } = await api.get('/auth/profile');
            localStorage.setItem('userInfo', JSON.stringify({ ...user, ...data }));
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleAddressSave = async () => {
        try {
            let updatedAddresses = [...addresses];
            if (editingAddress) {
                // Update existing address
                const index = updatedAddresses.findIndex(a => a._id === editingAddress._id);
                if (index > -1) {
                    updatedAddresses[index] = { ...newAddress, _id: editingAddress._id };
                }
                toast.success('Address updated');
            } else {
                // Add new address
                updatedAddresses.push({ ...newAddress, _id: Date.now().toString() });
                toast.success('Address added');
            }
            setAddresses(updatedAddresses);
            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
            setShowAddressForm(false);
            setEditingAddress(null);
            setNewAddress({
                fullName: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                pincode: '',
                type: 'Home'
            });
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = addresses.filter(a => a._id !== id);
            setAddresses(updatedAddresses);
            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
            toast.success('Address deleted');
        }
    };

    if (!user) {
        return <div className="container mx-auto px-4 md:px-8 py-20 text-center">Please login to view your profile.</div>;
    }

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
                            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                        className="w-full border border-gray-300 rounded px-4 py-3" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                        className="w-full border border-gray-300 rounded px-4 py-3" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Phone</label>
                                    <input 
                                        type="tel" 
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        className="w-full border border-gray-300 rounded px-4 py-3" 
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <button type="submit" className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {loadingOrders ? (
                                <div className="text-center py-8 text-gray-500">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
                                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">No Orders Yet</h3>
                                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                                    <a href="/shop" className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 inline-block">
                                        Start Shopping
                                    </a>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order._id} className="bg-white border border-gray-100 rounded-xl p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 mb-4">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                                    <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="text-sm text-gray-500">+{order.items.length - 3} more</div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                            <span className="font-bold">Total: ₹{order.totalAmount}</span>
                                            <a href={`/order/${order._id}`} className="text-primary font-bold text-sm hover:underline">View Details</a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="space-y-6">
                            {addresses.length === 0 && !showAddressForm && (
                                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
                                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">No Addresses Saved</h3>
                                    <p className="text-gray-500 mb-6">Add an address to make checkout faster.</p>
                                    <button 
                                        onClick={() => setShowAddressForm(true)}
                                        className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800"
                                    >
                                        Add Address
                                    </button>
                                </div>
                            )}

                            {showAddressForm && (
                                <div className="bg-white border border-gray-100 rounded-xl p-6">
                                    <h3 className="text-xl font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={newAddress.fullName}
                                                onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Phone</label>
                                            <input 
                                                type="tel" 
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-2">Address Line 1</label>
                                            <input 
                                                type="text" 
                                                value={newAddress.addressLine1}
                                                onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-2">Address Line 2 (Optional)</label>
                                            <input 
                                                type="text" 
                                                value={newAddress.addressLine2}
                                                onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">City</label>
                                            <input 
                                                type="text" 
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">State</label>
                                            <input 
                                                type="text" 
                                                value={newAddress.state}
                                                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Pincode</label>
                                            <input 
                                                type="text" 
                                                value={newAddress.pincode}
                                                onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Type</label>
                                            <select 
                                                value={newAddress.type}
                                                onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-4 py-3"
                                            >
                                                <option>Home</option>
                                                <option>Work</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button 
                                            onClick={handleAddressSave}
                                            className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800"
                                        >
                                            Save Address
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setShowAddressForm(false);
                                                setEditingAddress(null);
                                                setNewAddress({
                                                    fullName: '',
                                                    phone: '',
                                                    addressLine1: '',
                                                    addressLine2: '',
                                                    city: '',
                                                    state: '',
                                                    pincode: '',
                                                    type: 'Home'
                                                });
                                            }}
                                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded font-bold hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.map((address) => (
                                    <div key={address._id} className="border border-gray-200 rounded-xl p-6 relative">
                                        {address.isDefault && (
                                            <span className="absolute top-4 right-4 bg-gray-100 text-xs font-bold px-2 py-1 rounded">DEFAULT</span>
                                        )}
                                        <h3 className="font-bold mb-2">{address.type || 'Home'}</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {address.fullName}<br />
                                            {address.addressLine1}<br />
                                            {address.addressLine2 && <>{address.addressLine2}<br /></>}
                                            {address.city}, {address.state} - {address.pincode}<br />
                                            Phone: {address.phone}
                                        </p>
                                        <div className="flex space-x-4 text-sm font-bold text-gray-500">
                                            <button 
                                                onClick={() => {
                                                    setEditingAddress(address);
                                                    setNewAddress(address);
                                                    setShowAddressForm(true);
                                                }}
                                                className="hover:text-black"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAddress(address._id)}
                                                className="hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {addresses.length > 0 && !showAddressForm && (
                                    <button 
                                        onClick={() => setShowAddressForm(true)}
                                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors min-h-[200px]"
                                    >
                                        <span className="text-4xl mb-2">+</span>
                                        <span className="font-bold">Add New Address</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
