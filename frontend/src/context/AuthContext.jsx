import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api/auth';

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/login`, { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Login Successful!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const { data } = await axios.post(`${API_URL}/register`, { name, email, password, phone });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Registration Successful!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
