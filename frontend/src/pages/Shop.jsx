import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Grid, List } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Filters from '../components/shop/Filters';
import api from '../utils/api';

const Shop = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useAuth();
    const [cookiesAccepted, setCookiesAccepted] = useState(localStorage.getItem('cookieConsent') === 'true');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = searchQuery ? `/products?keyword=${searchQuery}` : '/products';
                const { data } = await api.get(url);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        if (user && cookiesAccepted) {
            const timer = setTimeout(() => {
                fetchProducts();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [user, cookiesAccepted, searchQuery]);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setCookiesAccepted(true);
    };

    if (!user || !cookiesAccepted) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white text-center p-4">
                <div className="max-w-md w-full bg-white text-black p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-black mb-4">ACCESS RESTRICTED</h2>
                    {!user && (
                        <div className="mb-6">
                            <p className="mb-4 text-gray-600">Please login to access the exclusive shop.</p>
                            <Link to="/login" className="block w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors">
                                LOGIN NOW
                            </Link>
                            <p className="mt-2 text-sm text-gray-500">
                                Don't have an account? <Link to="/register" className="underline font-bold">Register</Link>
                            </p>
                        </div>
                    )}

                    {user && !cookiesAccepted && (
                        <div>
                            <p className="mb-4 text-gray-600">We use cookies to ensure you get the best experience on our website.</p>
                            <button onClick={handleAcceptCookies} className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors">
                                ACCEPT COOKIES
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-8 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-bold">Shop</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar (Desktop) */}
                <div className="hidden md:block w-72 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4">
                    <Filters />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:max-w-xs border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
                            />
                            <button
                                className="md:hidden flex items-center gap-2 border border-gray-300 rounded px-4 py-2 font-bold"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <Filter size={18} /> Filters
                            </button>
                            <p className="text-gray-500 whitespace-nowrap">Showing <span className="font-bold text-black">{products.length}</span> results</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
                                <span className="text-gray-500 text-sm">Sort by:</span>
                                <div className="relative group">
                                    <button className="flex items-center gap-1 font-bold">
                                        Newest <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? "text-black" : "hover:text-black"}><Grid size={20} /></button>
                                <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? "text-black" : "hover:text-black"}><List size={20} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="py-20 text-center">Loading Products...</div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12 flex justify-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center border border-black bg-black text-white font-bold rounded">1</button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-black rounded transition-colors">2</button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-black rounded transition-colors">3</button>
                        <span className="w-10 h-10 flex items-center justify-center">...</span>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-black rounded transition-colors">&gt;</button>
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer - Simplified for now */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-start">
                    <div className="bg-white w-3/4 h-full p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="text-xl font-bold">×</button>
                        </div>
                        <Filters />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
