import React from 'react';

const Shipping = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-black mb-8 text-center">SHIPPING INFO</h1>
            <div className="space-y-8">
                <div className="border border-black p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Standard Delivery</h3>
                    <p className="text-gray-600">5-7 Business Days</p>
                    <p className="text-xl font-bold mt-2">Free</p>
                </div>

                <div className="border border-gray-200 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Express Delivery</h3>
                    <p className="text-gray-600">2-3 Business Days</p>
                    <p className="text-xl font-bold mt-2">₹199</p>
                </div>

                <div className="mt-8 text-gray-600 leading-relaxed">
                    <p className="mb-4">
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                    </p>
                    <p>
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
