import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
    // Mock Cart Data
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Premium Oversized Urban Hoodie",
            price: 2499,
            size: "L",
            color: "Black",
            quantity: 1,
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 2,
            name: "Street Graphic Tee",
            price: 699,
            size: "M",
            color: "White",
            quantity: 2,
            image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=200"
        }
    ]);

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + tax + shipping;

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
                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-6">
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
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 text-sm font-medium mt-2 flex items-center hover:text-red-700"
                                        >
                                            <Trash2 size={14} className="mr-1" /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-4 md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
                                    <span className="md:hidden font-bold mr-2 text-gray-500">Price: </span>
                                    <span className="font-medium">₹{item.price}</span>
                                </div>

                                {/* Quantity */}
                                <div className="col-span-4 md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button
                                            className="px-2 py-1 hover:bg-gray-100"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >-</button>
                                        <span className="px-2 w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            className="px-2 py-1 hover:bg-gray-100"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >+</button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="col-span-4 md:col-span-2 flex md:justify-end items-center mt-2 md:mt-0 font-bold">
                                    <span className="md:hidden font-bold mr-2 text-gray-500">Total: </span>
                                    ₹{item.price * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{subtotal}</span>
                            </div>
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
                                <span className="font-black text-2xl">₹{total}</span>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="mb-6">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                                />
                                <button className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800">
                                    APPLY
                                </button>
                            </div>
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
