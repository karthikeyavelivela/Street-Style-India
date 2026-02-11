import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: "Free Shipping",
        desc: "On orders above ₹1499 Pettu"
    },
    {
        icon: RotateCcw,
        title: "7-Day Returns",
        desc: "Easy return policy"
    },
    {
        icon: ShieldCheck,
        title: "Premium Quality",
        desc: "100% Cotton fabrics"
    },
    {
        icon: CreditCard,
        title: "Secure Payments",
        desc: "Safe & encrypted"
    }
];

const WhyChooseSSI = () => {
    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center p-4">
                                <div className="bg-primary/5 text-primary p-4 rounded-full mb-4">
                                    <Icon size={32} />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSSI;
