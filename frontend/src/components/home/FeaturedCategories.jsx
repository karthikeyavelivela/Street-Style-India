import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        title: "T-Shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
        link: "/shop?category=t-shirts"
    },
    {
        id: 2,
        title: "Hoodies",
        image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&q=80&w=800",
        link: "/shop?category=hoodies"
    },
    {
        id: 3,
        title: "Oversized",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
        link: "/shop?category=oversized"
    }
];

const FeaturedCategories = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-black text-center mb-12 tracking-tight">FEATURED CATEGORIES</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={cat.link}
                            className="group relative h-[400px] overflow-hidden rounded-xl shadow-lg"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/40 transition-colors duration-300" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-3xl font-bold text-white uppercase tracking-wider border-2 border-white px-6 py-3 transition-transform duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-black">
                                    {cat.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
