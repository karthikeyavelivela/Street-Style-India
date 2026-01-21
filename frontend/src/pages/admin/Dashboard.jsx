import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingBag, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import api from '../../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-black">{value}</h3>
            {change !== undefined && (
                <p className="text-xs text-gray-400 mt-1">{change > 0 ? '+' : ''}{change}% from last period</p>
            )}
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
        weeklyOrders: 0,
        monthlyOrders: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        revenueData: [],
        categoryData: [],
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

    if (loading) return <div className="text-center py-8">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Customers" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="bg-purple-500" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
                <StatCard title="Total Products" value={stats.totalProducts} icon={TrendingUp} color="bg-red-500" />
            </div>

            {/* Weekly/Monthly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm font-medium">Weekly Orders</p>
                        <Calendar size={20} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-black">{stats.weeklyOrders || 0}</h3>
                    <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm font-medium">Monthly Orders</p>
                        <Calendar size={20} className="text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-black">{stats.monthlyOrders || 0}</h3>
                    <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm font-medium">Weekly Revenue</p>
                        <DollarSign size={20} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black">₹{stats.weeklyRevenue?.toLocaleString() || 0}</h3>
                    <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm font-medium">Monthly Revenue</p>
                        <DollarSign size={20} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black">₹{stats.monthlyRevenue?.toLocaleString() || 0}</h3>
                    <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-6">Revenue Analytics (Last 6 Months)</h3>
                    <div className="h-80 w-full">
                        {stats.revenueData && stats.revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#DC143C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No revenue data available
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-6">Category Distribution</h3>
                    <div className="h-80 w-full">
                        {stats.categoryData && stats.categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No category data available
                            </div>
                        )}
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
                                {stats.recentOrders && stats.recentOrders.map((order, i) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2 font-mono font-medium">#{order.orderNumber || order._id.substring(0, 8)}</td>
                                        <td className="py-3 px-2 font-bold">₹{order.totalAmount}</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-100">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats.recentOrders || stats.recentOrders.length === 0) && (
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
