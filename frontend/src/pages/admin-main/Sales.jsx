import React, { useState, useEffect } from 'react';
import { Warehouse } from 'lucide-react';
import api from '../../utils/api';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            const { data } = await api.get('/admin-main/sales', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Sales...</div>;

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black">Offline Sales</h2>
                    <p className="text-gray-500">Total: ₹{totalSales.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Product</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Quantity</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Price</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Total</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sales.map((sale) => (
                            <tr key={sale._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">{sale.productName}</td>
                                <td className="px-6 py-4">{sale.quantity}</td>
                                <td className="px-6 py-4">₹{sale.price}</td>
                                <td className="px-6 py-4 font-bold">₹{sale.total}</td>
                                <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;




