import React, { useState, useEffect } from 'react';
import { Package, Users, DollarSign, TrendingUp, AlertTriangle, Warehouse } from 'lucide-react';
import api from '../../utils/api';

const Dashboard = ({ searchQuery }) => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalEmployees: 0,
        totalOfflineSales: 0,
        totalExpenses: 0,
        monthlyExpenses: 0,
        totalStock: 0,
        availableStock: 0,
        lowStockAlerts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            const { data } = await api.get('/admin-main/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading Dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
        { title: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'bg-green-500' },
        { title: 'Offline Sales', value: `₹${stats.totalOfflineSales.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
        { title: 'Total Expenses', value: `₹${stats.totalExpenses.toLocaleString()}`, icon: TrendingUp, color: 'bg-red-500' },
        { title: 'Available Stock', value: stats.availableStock, icon: Warehouse, color: 'bg-orange-500' },
        { title: 'Low Stock Alerts', value: stats.lowStockAlerts, icon: AlertTriangle, color: 'bg-yellow-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                                    <h3 className="text-2xl font-black">{card.value}</h3>
                                </div>
                                <div className={`p-4 rounded-full ${card.color}`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Monthly Expenses</h3>
                    <p className="text-3xl font-black text-red-600">₹{stats.monthlyExpenses.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">Current month total</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Stock Status</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Stock</span>
                            <span className="font-bold">{stats.totalStock}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Available</span>
                            <span className="font-bold text-green-600">{stats.availableStock}</span>
                        </div>
                        {stats.lowStockAlerts > 0 && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm font-bold text-yellow-700">
                                    ⚠️ {stats.lowStockAlerts} products need restocking
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;




