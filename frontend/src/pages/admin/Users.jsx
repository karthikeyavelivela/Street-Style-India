import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Mail, Phone, Calendar, Shield } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/admin/users');
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading Users...</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black">{user.name}</p>
                                            <p className="text-gray-400 text-xs">ID: {user._id.substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" /> {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-gray-400" /> {user.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-black text-white' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {user.role === 'admin' && <Shield size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
