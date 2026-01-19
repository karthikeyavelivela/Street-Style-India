import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const { register: registerUser, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        await registerUser(data.name, data.email, data.password, data.phone);
    };

    const password = watch("password");

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-white">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">CREATE ACCOUNT</h1>
                    <p className="text-gray-500">Join the SSI community today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2">Full Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:border-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

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
                        <label className="block text-sm font-bold mb-2">Phone (Optional)</label>
                        <input
                            {...register("phone")}
                            type="tel"
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black"
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            type="password"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:border-black ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                            type="password"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:border-black ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating Account...' : 'REGISTER'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
