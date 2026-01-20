import React from 'react';

const Returns = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-black mb-8 text-center">RETURNS POLICY</h1>
            <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                    At Street Style India (SSI), we want you to love your gear. If you're not completely satisfied with your purchase, we're here to help.
                </p>
                <h3 className="text-xl font-bold text-black mt-8">30-Day Returns</h3>
                <p>
                    You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
                </p>
                <h3 className="text-xl font-bold text-black mt-8">Refunds</h3>
                <p>
                    Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).
                </p>
                <h3 className="text-xl font-bold text-black mt-8">Shipping</h3>
                <p>
                    You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
                </p>
                <div className="bg-gray-100 p-6 rounded-xl mt-8">
                    <p className="font-medium text-sm">For any questions on how to return your item to us, contact us at <span className="font-bold">support@streetstyleindia.com</span>.</p>
                </div>
            </div>
        </div>
    );
};

export default Returns;
