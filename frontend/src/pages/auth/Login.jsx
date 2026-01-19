import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        await login(data.email, data.password);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-white">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">WELCOME BACK</h1>
                    <p className="text-gray-500">Login to access your personalized feed</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Email Address</label>
                        <input
                            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                            type="email"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:border-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            {...register("password", { required: "Password is required" })}
                            type="password"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:border-black ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Remember me
                        </label>
                        <Link to="/forgot-password" className="font-bold text-primary hover:underline">Forgot Password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Logging in...' : 'LOGIN'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Don't have an account? <Link to="/register" className="font-bold text-black hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
