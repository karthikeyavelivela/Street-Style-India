import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://street-style-india-1.onrender.com/api/auth';

    useEffect(() => {
        const loadUser = () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const parsedUser = JSON.parse(userInfo);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Error parsing userInfo:", error);
                    localStorage.removeItem('userInfo');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/login`, 
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Login Successful!");
            return true;
        } catch (error) {
            console.error("Login Error:", error);
            let errorMessage = "Login failed";
            
            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                if (error.response.status === 401) {
                    errorMessage = "Invalid email or password. Please check your credentials.";
                } else if (error.response.status === 404) {
                    errorMessage = "Login endpoint not found. Please check the backend connection.";
                } else if (error.response.status >= 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Unable to connect to server. Please check your internet connection and ensure the backend is running.";
            } else {
                // Something else happened
                errorMessage = error.message || "An unexpected error occurred";
            }
            
            toast.error(errorMessage);
            return false;
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const { data } = await axios.post(`${API_URL}/register`, 
                { name, email, password, phone },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Registration Successful!");
            return true;
        } catch (error) {
            console.error("Registration Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Registration failed";
            toast.error(errorMessage);
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
