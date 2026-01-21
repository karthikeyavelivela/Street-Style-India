import React, { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchArrivals = async () => {
            try {
                const { data } = await api.get('/products', { params: { sort: 'latest', limit: 8 } });
                setItems(data);
            } catch (error) {
                console.error("Failed to load new arrivals", error);
            }
        };
        fetchArrivals();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">NEW ARRIVALS</h2>
                        <p className="text-gray-500">Fresh drops this week</p>
                    </div>
                    <Link to="/shop" className="text-primary font-bold hover:text-red-700 underline underline-offset-4">
                        View All
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-6 md:gap-8 pb-4 scrollbar-hide snap-x">
                    {items.map((product) => (
                        <div key={product._id} className="min-w-[280px] md:min-w-[300px] snap-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-gray-500">No new arrivals yet.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
