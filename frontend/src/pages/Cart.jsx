import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cart');
            setCartItems(data.items || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;
        try {
            await api.put(`/cart/${itemId}`, { quantity: newQty });
            await fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            await fetchCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }
        try {
            // Mock coupon validation - in real app, this would call an API
            const coupons = {
                'WELCOME10': { discount: 10, type: 'percentage' },
                'SAVE20': { discount: 20, type: 'percentage' },
                'FLAT500': { discount: 500, type: 'fixed' }
            };
            
            const coupon = coupons[couponCode.toUpperCase()];
            if (coupon) {
                setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
                if (coupon.type === 'percentage') {
                    setDiscount((subtotal * coupon.discount) / 100);
                } else {
                    setDiscount(coupon.discount);
                }
                toast.success("Coupon applied successfully!");
            } else {
                toast.error("Invalid coupon code");
            }
        } catch (error) {
            toast.error("Failed to apply coupon");
        }
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.discount > 0 
            ? item.price * (1 - item.discount / 100) 
            : item.price;
        return acc + (itemPrice * item.quantity);
    }, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = Math.max(0, subtotal + tax + shipping - discount);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-gray-500">Loading cart...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-flex bg-gray-100 p-8 rounded-full mb-6 text-gray-400">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-black mb-4">PLEASE LOGIN</h2>
                <p className="text-gray-500 mb-8">You need to be logged in to view your cart.</p>
                <Link
                    to="/login"
                    className="inline-flex items-center bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                    Login <ArrowRight className="ml-2" size={18} />
                </Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-flex bg-gray-100 p-8 rounded-full mb-6 text-gray-400">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-black mb-4">YOUR CART IS EMPTY</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/shop"
                    className="inline-flex items-center bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                    Start Shopping <ArrowRight className="ml-2" size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-8 py-8">
            <h1 className="text-3xl font-black mb-8">SHOPPING CART ({cartItems.length})</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-1">
                    <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    <div className="space-y-6 mt-6">
                        {cartItems.map((item) => {
                            const itemPrice = item.discount > 0 
                                ? item.price * (1 - item.discount / 100) 
                                : item.price;
                            return (
                                <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-6">
                                    {/* Product Info */}
                                    <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                                        <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Size: {item.size} • Color: {item.color}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="text-red-500 text-sm font-medium mt-2 flex items-center hover:text-red-700"
                                            >
                                                <Trash2 size={14} className="mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-4 md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
                                        <span className="md:hidden font-bold mr-2 text-gray-500">Price: </span>
                                        <div className="flex flex-col items-center">
                                            <span className="font-medium">₹{Math.round(itemPrice)}</span>
                                            {item.discount > 0 && (
                                                <span className="text-xs text-gray-400 line-through">₹{item.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-4 md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
                                        <div className="flex items-center border border-gray-300 rounded">
                                            <button
                                                className="px-2 py-1 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            >-</button>
                                            <span className="px-2 w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                className="px-2 py-1 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-4 md:col-span-2 flex md:justify-end items-center mt-2 md:mt-0 font-bold">
                                        <span className="md:hidden font-bold mr-2 text-gray-500">Total: </span>
                                        ₹{Math.round(itemPrice * item.quantity)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{Math.round(subtotal)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Coupon ({appliedCoupon.code})</span>
                                    <span className="font-medium">-₹{Math.round(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (18% GST)</span>
                                <span className="font-medium">₹{tax}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-black text-2xl">₹{Math.round(total)}</span>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="mb-6">
                            {appliedCoupon ? (
                                <div className="bg-green-50 border border-green-200 rounded px-3 py-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-700">
                                        {appliedCoupon.code} Applied
                                    </span>
                                    <button
                                        onClick={() => {
                                            setAppliedCoupon(null);
                                            setDiscount(0);
                                            setCouponCode('');
                                        }}
                                        className="text-green-700 hover:text-green-900 text-sm font-bold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800"
                                    >
                                        APPLY
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link to="/checkout" className="block w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-lg text-center transition-colors shadow-lg shadow-red-200">
                            PROCEED TO CHECKOUT
                        </Link>

                        <div className="mt-4 flex items-center justify-center space-x-2 grayscale opacity-50">
                            {/* Payment icons placeholders */}
                            <div className="h-6 w-10 bg-gray-300 rounded"></div>
                            <div className="h-6 w-10 bg-gray-300 rounded"></div>
                            <div className="h-6 w-10 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
