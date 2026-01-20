import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since we didn't explicitly check orderRoutes for admin getAll, let's assume standard /api/orders with admin protection works
        // Verify: backend/routes/orderRoutes.js -> router.route("/").get(protect, admin, getAllOrders); (YES, we checked this)
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) { // Assuming status strings, defaulting to simple logic
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Delivered': return 'bg-blue-100 text-blue-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    if (loading) return <div>Loading Orders...</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
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
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-sm">
                                    {order._id.substring(0, 10).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold">{order.user?.name || 'Guest'}</p>
                                    <p className="text-gray-500 text-xs">{order.user?.email}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    ₹{order.totalPrice}
                                </td>
                                <td className="px-6 py-4">
                                    {order.isPaid ? (
                                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                                            <CheckCircle size={14} /> Paid
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-orange-500 text-xs font-bold uppercase">
                                            <Clock size={14} /> Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/order/${order._id}`} className="text-black hover:text-gray-600 transition-colors">
                                        <Eye size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
