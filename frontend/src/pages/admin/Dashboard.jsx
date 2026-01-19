import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import api from '../../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-black">{value}</h3>
            {/* Change % logic can be added if backend supports historical data */}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Dashboard...</div>;

    // Placeholder data for charts (Backend needs aggregation for real timeseries)
    const dataRevenue = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 7500 },
    ];

    const dataCategories = [
        { name: 'T-Shirts', value: 400 },
        { name: 'Hoodies', value: 300 },
        { name: 'Oversized', value: 300 },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Customers" value={stats.totalUsers} change={0} icon={Users} color="bg-blue-500" />
                <StatCard title="Total Orders" value={stats.totalOrders} change={0} icon={ShoppingBag} color="bg-purple-500" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} change={0} icon={DollarSign} color="bg-green-500" />
                <StatCard title="Total Products" value={stats.totalProducts} change={0} icon={TrendingUp} color="bg-red-500" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-6">Revenue Analytics (Demo Data)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataRevenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#DC143C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-6">Category Distribution (Demo Data)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataCategories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders Tables */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-6">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500">
                                    <th className="pb-3 px-2">Order ID</th>
                                    <th className="pb-3 px-2">Total</th>
                                    <th className="pb-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentOrders.map((order, i) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2 font-mono font-medium">{order._id.substring(0, 8)}...</td>
                                        <td className="py-3 px-2 font-bold">₹{order.totalAmount}</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-100">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-gray-500">No recent orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
