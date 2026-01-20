import React from 'react';
import { Plus } from 'lucide-react';

const FAQItem = ({ question, answer }) => (
    <div className="border-b border-gray-200 py-6 group cursor-pointer">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold group-hover:text-gray-600 transition-colors">{question}</h3>
            <Plus className="text-gray-400 group-hover:text-black transition-colors" />
        </div>
        <p className="text-gray-500 mt-4 leading-relaxed hidden group-hover:block">{answer}</p>
    </div>
);

const FAQ = () => {
    const faqs = [
        {
            q: "How do I track my order?",
            a: "Once your order ships, we'll send you an email with a tracking number. You can also view your order status in your account profile."
        },
        {
            q: "What is the delivery time?",
            a: "Standard shipping takes 5-7 business days. Express shipping is available and takes 2-3 business days."
        },
        {
            q: "Do you ship internationally?",
            a: "Currently, we ship across India. We are planning to expand internationally soon."
        },
        {
            q: "Size guide?",
            a: "We have a detailed size guide on each product page. Our fits are generally oversized, so if you prefer a regular fit, consider sizing down."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-black text-center mb-12">FAQ</h1>
            <div>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.q} answer={faq.a} />
                ))}
            </div>
        </div>
    );
};

export default FAQ;
