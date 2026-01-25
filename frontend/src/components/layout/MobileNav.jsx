import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const MobileNav = () => {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const fetchCartCount = async () => {
            if (user) {
                try {
                    const { data } = await api.get('/cart');
                    setCartCount(data.items?.length || 0);
                } catch (error) {
                    // Silently fail if cart fetch fails (404 is expected if route doesn't exist or cart doesn't exist yet)
                    if (error.response?.status !== 404) {
                        console.error("Error fetching cart count:", error);
                    }
                    setCartCount(0);
                }
            } else {
                setCartCount(0);
            }
        };
        fetchCartCount();
        const interval = setInterval(fetchCartCount, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Shop', path: '/shop', icon: ShoppingBag },
        { name: 'Search', path: '#', icon: Search, isSearch: true },
        { name: 'Cart', path: '/cart', icon: ShoppingCart, showBadge: true },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <>
            {/* Search Modal */}
            {searchOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-20 px-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-4 shadow-xl">
                        <div className="flex items-center space-x-2 mb-4">
                            <Search size={20} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 shadow-lg">
                <div className="flex justify-around items-center px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        
                        if (item.isSearch) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    className={`flex flex-col items-center justify-center relative px-3 py-1 ${
                                        searchOpen ? 'text-primary' : 'text-gray-500'
                                    }`}
                                >
                                    <div className="relative">
                                        <Icon size={24} strokeWidth={searchOpen ? 2.5 : 2} />
                                    </div>
                                    <span className={`text-[10px] font-medium mt-0.5 ${searchOpen ? 'text-primary' : 'text-gray-500'}`}>
                                        {item.name}
                                    </span>
                                    {searchOpen && (
                                        <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
                                    )}
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex flex-col items-center justify-center relative
                                    ${isActive ? 'text-primary' : 'text-gray-500'}
                                `}
                            >
                                {({ isActive }) => (
                                    <div className="flex flex-col items-center relative px-3 py-1">
                                        <div className="relative">
                                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                            {item.showBadge && cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                                                    {cartCount > 9 ? '9+' : cartCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
                                        )}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MobileNav;
