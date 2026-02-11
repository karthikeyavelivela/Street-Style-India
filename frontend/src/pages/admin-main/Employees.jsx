import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import api from '../../utils/api';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        salary: 0,
        status: 'active'
    });

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const fetchEmployees = async () => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            const { data } = await api.get('/admin-main/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            const { data } = await api.get('/admin-main/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            await api.post('/admin-main/employees', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '', department: '', role: '', salary: 0, status: 'active' });
            fetchEmployees();
        } catch (error) {
            console.error('Error creating employee:', error);
            alert('Error creating employee');
        }
    };

    if (loading) return <div>Loading Employees...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Employees</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Employee
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black mb-4">Add Employee</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-2 border rounded"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="px-4 py-2 border rounded"
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="px-4 py-2 border rounded"
                        />
                        <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="px-4 py-2 border rounded"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="px-4 py-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={formData.salary}
                            onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) })}
                            className="px-4 py-2 border rounded"
                            required
                        />
                        <div className="col-span-2 flex gap-4">
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
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Department</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Role</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Salary</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {employees.map((emp) => (
                            <tr key={emp._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">{emp.name}</td>
                                <td className="px-6 py-4">{emp.department?.name || '-'}</td>
                                <td className="px-6 py-4">{emp.role}</td>
                                <td className="px-6 py-4">₹{emp.salary.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {emp.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employees;




