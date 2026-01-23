import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import api from '../../utils/api';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get('/reviews', { params: { limit: 12 } });
                setReviews(data);
            } catch (error) {
                console.error("Failed to load reviews", error);
            }
        };
        fetchReviews();
    }, []);

    const extendedReviews = useMemo(() => {
        if (reviews.length === 0) return [];
        return [...reviews, ...reviews];
    }, [reviews]);

    return (
        <section className="py-20 bg-gray-50 text-center overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 mb-12">
                <h2 className="text-3xl font-black tracking-tight">WHAT THEY SAY</h2>
            </div>

            <div className="relative w-full">
                {extendedReviews.length > 0 ? (
                    <div className="flex animate-scroll-cards gap-8 px-4 w-max hover:paused">
                        {extendedReviews.map((review, index) => (
                            <div key={`${review._id || index}-${index}`} className="w-[300px] md:w-[400px] bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic">"{review.comment || review.text}"</p>
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold border-2 border-white shadow uppercase">
                                        {review.name?.slice(0, 2) || "RV"}
                                    </div>
                                    <span className="font-bold text-gray-900">{review.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Reviews will appear here as customers share feedback.</p>
                )}
            </div>

            <style jsx>{`
                @keyframes scroll-cards {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-cards {
                    animation: scroll-cards 40s linear infinite;
                }
                .hover\\:paused:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default CustomerReviews;
