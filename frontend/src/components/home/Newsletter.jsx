import React from 'react';
import { ArrowRight } from 'lucide-react';

const Newsletter = () => {
    return (
        <section className="py-20 bg-black text-white">
            <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">JOIN THE CLUB</h2>
                <p className="text-gray-400 mb-8 text-lg">
                    Subscribe to our newsletter and get <span className="text-primary font-bold">10% off</span> your first order.
                    Be the first to know about new drops.
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        type="submit"
                        className="bg-primary hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full transition-colors flex items-center justify-center whitespace-nowrap"
                    >
                        Subscribe <ArrowRight className="ml-2" size={20} />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
