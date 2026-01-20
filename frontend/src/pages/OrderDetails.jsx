import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, MapPin, CreditCard } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="p-20 text-center">Loading Order Details...</div>;
    if (error) return <div className="p-20 text-center text-red-500 font-bold">Error: {error}</div>;
    if (!order) return <div className="p-20 text-center">Order not found</div>;

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
                <div className="px-4 py-2 bg-black text-white font-bold rounded text-sm uppercase">
                    {order.status || 'Processing'}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Package size={20} /> Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.qty} | Price: ₹{item.price}</p>
                                    </div>
                                    <div className="font-bold">₹{item.price * item.qty}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={20} /> Shipping</h2>
                        <div className="text-gray-600">
                            <p className="font-bold text-black">{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.itemsPrice || order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>₹{order.shippingPrice || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>₹{order.taxPrice || 0}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment</h2>
                        <p className="text-gray-600">Method: {order.paymentMethod}</p>
                        <p className={`text-sm font-bold mt-2 ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                            {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Payment Pending'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
