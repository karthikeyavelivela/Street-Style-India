import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "Rahul K.",
        rating: 5,
        text: "The quality of the oversized tees is amazing. Definitely worth the price. Will buy again!",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
    },
    {
        id: 2,
        name: "Priya S.",
        rating: 5,
        text: "Loved the fit and fabric. Delivery was super fast too. SSI is my new favorite brand.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
    },
    {
        id: 3,
        name: "Amit M.",
        rating: 4,
        text: "Great designs. The hoodie is very comfortable. Just wish they had more colors in stock.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
    }
];

const CustomerReviews = () => {
    return (
        <section className="py-20 bg-gray-50 text-center">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-black mb-12 tracking-tight">WHAT THEY SAY</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                            <div className="flex items-center justify-center space-x-4">
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                                />
                                <span className="font-bold text-gray-900">{review.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerReviews;
