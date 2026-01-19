import React, { useState } from 'react';
import { Check, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(3);
            window.scrollTo(0, 0);
        }, 2000);
    };

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
                            <input type="text" required className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" placeholder="John Doe" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold mb-2">Phone Number</label>
                            <input type="tel" required className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" placeholder="+91 98765 43210" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-2">Address Line 1</label>
                            <input type="text" required className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" placeholder="Flat No, Building Name" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-2">Address Line 2 (Optional)</label>
                            <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" placeholder="Street Name, Area" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">City</label>
                            <input type="text" required className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" placeholder="Bangalore" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">State</label>
                            <select className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black">
                                <option>Karnataka</option>
                                <option>Maharashtra</option>
                                <option>Delhi</option>
                                <option>Telangana</option>
                                <option>Tamil Nadu</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Pincode</label>
                            <input type="text" required className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black" placeholder="560001" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Type</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="addressType" defaultChecked className="mr-2" /> Home
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="addressType" className="mr-2" /> Work
                                </label>
                            </div>
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
                            <label className="flex items-center border p-4 rounded-lg cursor-pointer hover:border-black transition-colors">
                                <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-primary accent-primary" />
                                <div className="ml-4">
                                    <span className="block font-bold">UPI / Cards / Netbanking</span>
                                    <span className="text-sm text-gray-500">Razorpay Secure Payment</span>
                                </div>
                                <div className="ml-auto flex space-x-2">
                                    <div className="h-6 w-10 bg-blue-100 rounded"></div>
                                    <div className="h-6 w-10 bg-green-100 rounded"></div>
                                </div>
                            </label>

                            <label className="flex items-center border p-4 rounded-lg cursor-pointer hover:border-black transition-colors">
                                <input type="radio" name="payment" className="w-5 h-5 text-primary accent-primary" />
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
                                disabled={loading}
                                className={`
                                    bg-primary text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition-colors flex items-center
                                    ${loading ? 'opacity-70 cursor-wait' : ''}
                                `}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-gray-50 p-6 rounded-xl h-fit">
                        <h3 className="font-bold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between"><span>Items (3)</span><span>₹3,897</span></div>
                            <div className="flex justify-between"><span>Tax</span><span>₹701</span></div>
                            <div className="flex justify-between"><span>Delivery</span><span className="text-green-600">Free</span></div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₹4,598</span></div>
                        </div>
                        <div className="text-xs text-center text-gray-400">
                            By placing order you agree to our Terms
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black mb-2">ORDER CONFIRMED!</h2>
                    <p className="text-gray-500 mb-8">Thank you for shopping with Street Style India.</p>

                    <div className="bg-gray-50 p-8 rounded-xl text-left border border-gray-100 mb-8">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-mono font-bold">#SSI-29384</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Date:</span>
                            <span className="font-medium">Jan 19, 2026</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Est. Delivery:</span>
                            <span className="font-medium">Jan 24, 2026</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Method:</span>
                            <span className="font-medium">Razorpay (Paid)</span>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Link to="/orders" className="border border-gray-300 px-6 py-3 rounded font-bold hover:bg-gray-50">
                            Track Order
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
