import React, { useState, useEffect } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import api from '../../utils/api';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        amount: 0,
        category: 'Misc',
        description: ''
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            const { data } = await api.get('/admin-main/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            await api.post('/admin-main/expenses', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({ title: '', amount: 0, category: 'Misc', description: '' });
            fetchExpenses();
        } catch (error) {
            console.error('Error creating expense:', error);
            alert('Error creating expense');
        }
    };

    if (loading) return <div>Loading Expenses...</div>;

    const categories = ['Rent', 'Electricity', 'Salary', 'Transport', 'Misc', 'Other'];
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black">Expenses</h2>
                    <p className="text-gray-500">Total: ₹{totalExpenses.toLocaleString()}</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Expense
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black mb-4">Add Expense</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border rounded"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded"
                            rows={3}
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-bold">
                                Create
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded font-bold">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Title</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Category</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Amount</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {expenses.map((exp) => (
                            <tr key={exp._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">{exp.title}</td>
                                <td className="px-6 py-4">{exp.category}</td>
                                <td className="px-6 py-4">₹{exp.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">{new Date(exp.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expenses;




