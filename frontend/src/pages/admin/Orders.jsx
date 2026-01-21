import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [cancelDecision, setCancelDecision] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            toast.success('Order status updated');
            fetchOrders();
            setEditingOrder(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const updatePaymentStatus = async (orderId, paymentStatus) => {
        try {
            await api.put(`/orders/${orderId}/payment`, { paymentStatus });
            toast.success('Payment status updated');
            fetchOrders();
            setEditingOrder(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update payment status');
        }
    };

    const handleEditClick = (order) => {
        setEditingOrder(order._id);
        setOrderStatus(order.status);
        setPaymentStatus(order.paymentStatus);
        setCancelDecision(order.cancellationStatus);
    };

    const handleSave = (orderId) => {
        if (orderStatus) {
            updateOrderStatus(orderId, orderStatus);
        }
        if (paymentStatus) {
            updatePaymentStatus(orderId, paymentStatus);
        }
        if (cancelDecision && cancelDecision !== 'None' && cancelDecision !== 'Requested') {
            updateCancellation(orderId, cancelDecision);
        }
    };

    const updateCancellation = async (orderId, decision) => {
        try {
            await api.put(`/orders/${orderId}/cancel-response`, { decision });
            toast.success('Cancellation updated');
            fetchOrders();
            setEditingOrder(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cancellation');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="text-center py-8">Loading Orders...</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-black">ORDERS MANAGEMENT</h2>
                <p className="text-gray-500 text-sm mt-1">Manage all customer orders</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Cancel</th>
            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-sm">
                                    #{order.orderNumber || order._id.substring(0, 10).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                    {editingOrder === order._id ? (
                                        <select
                                            value={cancelDecision}
                                            onChange={(e) => setCancelDecision(e.target.value)}
                                            className="text-xs border rounded px-2 py-1"
                                        >
                                            <option value="None">None</option>
                                            <option value="Requested">Requested</option>
                                            <option value="Accepted">Accept</option>
                                            <option value="Rejected">Reject</option>
                                        </select>
                                    ) : (
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100">
                                            {order.cancellationStatus || 'None'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold">
                                        {order.userId?.name || order.shippingAddress?.fullName || 'Guest'}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        {order.userId?.phone || order.shippingAddress?.phone || 'N/A'}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    ₹{order.totalAmount || 0}
                                </td>
                                <td className="px-6 py-4">
                                    {editingOrder === order._id ? (
                                        <select
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                            className="text-xs border rounded px-2 py-1"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPaymentStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus || 'Pending'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingOrder === order._id ? (
                                        <select
                                            value={orderStatus}
                                            onChange={(e) => setOrderStatus(e.target.value)}
                                            className="text-xs border rounded px-2 py-1"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingOrder === order._id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSave(order._id)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Save"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingOrder(null);
                                                    setOrderStatus('');
                                                    setPaymentStatus('');
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                                title="Cancel"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(order)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
