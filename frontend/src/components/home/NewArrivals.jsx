import React from 'react';
import ProductCard from '../product/ProductCard';

const products = [
    {
        id: 11,
        name: "Limited Edition Hoodie",
        price: 2499,
        discount: 0,
        image1: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=600",
        category: "Hoodies"
    },
    {
        id: 12,
        name: "Acid Wash Tee",
        price: 899,
        discount: 10,
        image1: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600",
        category: "Oversized"
    },
    {
        id: 13,
        name: "Street Cargo Joggers",
        price: 1599,
        discount: 0,
        image1: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600",
        category: "Pants"
    },
    {
        id: 14,
        name: "Graphic Back Print",
        price: 799,
        discount: 0,
        image1: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=600",
        category: "T-Shirts"
    },
];

const NewArrivals = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">NEW ARRIVALS</h2>
                        <p className="text-gray-500">Fresh drops this week</p>
                    </div>
                    <button className="text-primary font-bold hover:text-red-700 underline underline-offset-4">
                        View All
                    </button>
                </div>

                <div className="flex overflow-x-auto gap-6 md:gap-8 pb-4 scrollbar-hide snap-x">
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[300px] snap-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {/* Duplicate for demo scroll length if needed, or just leave as is */}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
