import React, { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';
import api from '../../utils/api';

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                // Filter specifically for trending or just show first 8 for now
                setProducts(data.filter(p => p.trending).slice(0, 8));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="py-20 text-center">Loading Trending Styles...</div>;
    }

    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">TRENDING NOW</h2>
                        <p className="text-gray-500">Fastest selling street wear this week</p>
                    </div>
                    <button className="hidden md:block border-b-2 border-black pb-1 font-bold hover:text-primary hover:border-primary transition-colors">
                        VIEW ALL
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button className="border-b-2 border-black pb-1 font-bold">VIEW ALL</button>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
