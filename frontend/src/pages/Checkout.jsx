import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    
    // Address form state
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: 'Karnataka',
        pincode: '',
    });
    
    // Payment method
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [createdOrder, setCreatedOrder] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [user, navigate]);

    const fetchCart = async () => {
        try {
            setLoadingCart(true);
            const { data } = await api.get('/cart');
            setCartItems(data.items || []);
            if (data.items.length === 0) {
                toast.info('Your cart is empty');
                navigate('/cart');
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            toast.error("Failed to load cart");
            navigate('/cart');
        } finally {
            setLoadingCart(false);
        }
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = async () => {
        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        if (paymentMethod === 'UPI') {
            toast.info("UPI payment coming soon!");
            return;
        }

        setLoading(true);
        try {
            // Calculate totals
            const subtotal = cartItems.reduce((acc, item) => {
                const itemPrice = item.discount > 0 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                return acc + (itemPrice * item.quantity);
            }, 0);
            const tax = Math.round(subtotal * 0.18);
            const shipping = subtotal > 1499 ? 0 : 99;
            const total = subtotal + tax + shipping;

            // Prepare order items
            const orderItems = cartItems.map(item => {
                const itemPrice = item.discount > 0 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                return {
                    productId: item.productId,
                    name: item.name,
                    price: Math.round(itemPrice),
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: item.image
                };
            });

            // Create order
            const orderData = {
                items: orderItems,
                shippingAddress: address,
                paymentMethod: paymentMethod,
                totalAmount: Math.round(total)
            };

            const { data: order } = await api.post('/orders', orderData);
            setCreatedOrder(order);

            // Clear cart
            try {
                await api.delete('/cart');
            } catch (error) {
                console.error("Error clearing cart:", error);
            }

            toast.success("Order placed successfully!");
            setStep(3);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.discount > 0 
            ? item.price * (1 - item.discount / 100) 
            : item.price;
        return acc + (itemPrice * item.quantity);
    }, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 1499 ? 0 : 99;
    const total = subtotal + tax + shipping;

    if (loadingCart) {
        return (
            <div className="container mx-auto px-4 md:px-8 py-20 text-center">
                <div className="text-gray-500">Loading checkout...</div>
            </div>
        );
    }

    if (cartItems.length === 0 && step < 3) {
        return null; // Will redirect
    }

    return (
        <div className="container mx-auto px-4 md:px-8 py-8">
            {/* Steps Indicator */}
            <div className="flex justify-center mb-12">
                <div className="flex items-center space-x-4 max-w-2xl w-full">
                    <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold mb-2 ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            {step > 1 ? <Check size={20} /> : '1'}
                        </div>
                        <span className="text-xs font-bold uppercase">Address</span>
                    </div>
                    <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold mb-2 ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            {step > 2 ? <Check size={20} /> : '2'}
                        </div>
                        <span className="text-xs font-bold uppercase">Payment</span>
                    </div>
                    <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold mb-2 ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            3
                        </div>
                        <span className="text-xs font-bold uppercase">Done</span>
                    </div>
                </div>
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black mb-6">SHIPPING ADDRESS</h2>
                    <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold mb-2">Full Name</label>
                            <input 
                                type="text" 
                                required 
                                value={address.fullName}
                                onChange={(e) => setAddress({...address, fullName: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" 
                                placeholder="John Doe" 
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold mb-2">Phone Number</label>
                            <input 
                                type="tel" 
                                required 
                                value={address.phone}
                                onChange={(e) => setAddress({...address, phone: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" 
                                placeholder="+91 98765 43210" 
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-2">Address Line 1</label>
                            <input 
                                type="text" 
                                required 
                                value={address.addressLine1}
                                onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" 
                                placeholder="Flat No, Building Name" 
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-2">Address Line 2 (Optional)</label>
                            <input 
                                type="text" 
                                value={address.addressLine2}
                                onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" 
                                placeholder="Street Name, Area" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">City</label>
                            <input 
                                type="text" 
                                required 
                                value={address.city}
                                onChange={(e) => setAddress({...address, city: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" 
                                placeholder="Bangalore" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">State</label>
                            <select 
                                value={address.state}
                                onChange={(e) => setAddress({...address, state: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black"
                            >
                                <option>Karnataka</option>
                                <option>Maharashtra</option>
                                <option>Delhi</option>
                                <option>Telangana</option>
                                <option>Tamil Nadu</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Pincode</label>
                            <input 
                                type="text" 
                                required 
                                value={address.pincode}
                                onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" 
                                placeholder="560001" 
                            />
                        </div>

                        <div className="col-span-2 mt-4 flex justify-end">
                            <button type="submit" className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition-colors">
                                Continue to Payment
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-black mb-6">PAYMENT METHOD</h2>
                        <div className="space-y-4">
                            <label className={`flex items-center border p-4 rounded-lg cursor-pointer transition-colors ${
                                paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'hover:border-black'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-primary accent-primary" 
                                />
                                <div className="ml-4">
                                    <span className="block font-bold">UPI / Cards / Netbanking</span>
                                    <span className="text-sm text-gray-500">Razorpay Secure Payment</span>
                                    {paymentMethod === 'UPI' && (
                                        <span className="block text-xs text-orange-600 font-bold mt-1">Coming Soon!</span>
                                    )}
                                </div>
                                <div className="ml-auto flex space-x-2">
                                    <div className="h-6 w-10 bg-blue-100 rounded"></div>
                                    <div className="h-6 w-10 bg-green-100 rounded"></div>
                                </div>
                            </label>

                            <label className={`flex items-center border p-4 rounded-lg cursor-pointer transition-colors ${
                                paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'hover:border-black'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-primary accent-primary" 
                                />
                                <div className="ml-4">
                                    <span className="block font-bold">Cash on Delivery</span>
                                    <span className="text-sm text-gray-500">Pay when you receive</span>
                                </div>
                                <Truck className="ml-auto text-gray-400" />
                            </label>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black">
                                Back
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={loading || paymentMethod === 'UPI'}
                                className={`
                                    bg-primary text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition-colors flex items-center
                                    ${loading ? 'opacity-70 cursor-wait' : ''}
                                    ${paymentMethod === 'UPI' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-gray-50 p-6 rounded-xl h-fit">
                        <h3 className="font-bold mb-4">Order Summary</h3>
                        {subtotal < 1499 && (
                            <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                <p className="text-xs font-bold text-primary">
                                    Add ₹{Math.ceil(1499 - subtotal)} more for <span className="uppercase">Free Shipping Pettu</span>
                                </p>
                            </div>
                        )}
                        {subtotal >= 1499 && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                                    <Truck size={14} />
                                    <span>You qualify for Free Shipping Pettu!</span>
                                </p>
                            </div>
                        )}
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span>Items ({cartItems.length})</span>
                                <span>₹{Math.round(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (18% GST)</span>
                                <span>₹{tax}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span className={shipping === 0 ? 'text-green-600' : ''}>
                                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{Math.round(total)}</span>
                            </div>
                        </div>
                        <div className="text-xs text-center text-gray-400">
                            By placing order you agree to our Terms
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && createdOrder && (
                <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black mb-2">ORDER CONFIRMED!</h2>
                    <p className="text-gray-500 mb-8">Thank you for shopping with Street Style India.</p>

                    <div className="bg-gray-50 p-8 rounded-xl text-left border border-gray-100 mb-8">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-mono font-bold">#{createdOrder._id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Date:</span>
                            <span className="font-medium">{new Date(createdOrder.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Est. Delivery:</span>
                            <span className="font-medium">
                                {new Date(new Date(createdOrder.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Method:</span>
                            <span className="font-medium">
                                {createdOrder.paymentMethod === 'COD' 
                                    ? `Cash on Delivery (${createdOrder.paymentStatus})` 
                                    : `${createdOrder.paymentMethod} (Coming Soon)`}
                            </span>
                        </div>
                        <div className="flex justify-between mt-4">
                            <span className="text-gray-500">Total Amount:</span>
                            <span className="font-bold text-lg">₹{createdOrder.totalAmount}</span>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Link to={`/order/${createdOrder._id}`} className="border border-gray-300 px-6 py-3 rounded font-bold hover:bg-gray-50">
                            View Order
                        </Link>
                        <Link to="/shop" className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
