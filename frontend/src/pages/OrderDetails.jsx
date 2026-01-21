import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order:", error);
                setError(error.response?.data?.message || "Failed to load order");
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const requestCancel = async () => {
        if (!order || order.status === 'Delivered' || order.status === 'Cancelled') {
            toast.error("Cannot cancel this order");
            return;
        }
        setCancelLoading(true);
        try {
            await api.post(`/orders/${order._id}/cancel-request`, { reason: 'Customer requested cancellation' });
            toast.success("Cancellation requested");
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to request cancellation");
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Order Details...</div>;
    if (error) return <div className="p-20 text-center text-red-500 font-bold">Error: {error}</div>;
    if (!order) return <div className="p-20 text-center">Order not found</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link to="/profile" className="text-gray-500 hover:text-black">← Back to My Orders</Link>
            </div>

            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-2xl font-black mb-2">Order #{order._id.substring(0, 10).toUpperCase()}</h1>
                    <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 font-bold rounded text-sm uppercase ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Cancellation: {order.cancellationStatus || 'None'}
                </div>
                {order.cancellationStatus === 'Requested' && (
                    <span className="text-orange-600 text-xs font-bold">Awaiting admin response</span>
                )}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && order.cancellationStatus !== 'Requested' && (
                    <button
                        onClick={requestCancel}
                        disabled={cancelLoading}
                        className="text-sm font-bold text-red-600 hover:text-red-800"
                    >
                        {cancelLoading ? 'Requesting...' : 'Request Cancellation'}
                    </button>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Package size={20} /> Items</h2>
                        <div className="space-y-4">
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                        <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-500">Price: ₹{item.price} each</p>
                                    </div>
                                    <div className="font-bold">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.shippingAddress && (
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={20} /> Shipping Address</h2>
                            <div className="text-gray-600">
                                <p className="font-bold text-black">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (18% GST)</span>
                                <span>₹{Math.round((order.totalAmount || 0) * 0.18 / 1.18)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{order.totalAmount || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment</h2>
                        <p className="text-gray-600 mb-2">Method: {order.paymentMethod || 'COD'}</p>
                        <p className={`text-sm font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                            {order.paymentStatus === 'Paid' 
                                ? `Paid` 
                                : order.paymentMethod === 'UPI'
                                ? 'Coming Soon'
                                : 'Payment Pending'}
                        </p>
                        {order.paymentMethod === 'COD' && (
                            <p className="text-xs text-gray-500 mt-2">Pay when you receive the order</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
