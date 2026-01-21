import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const MobileNav = () => {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);

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
        { name: 'Cart', path: '/cart', icon: ShoppingCart, showBadge: true },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 shadow-lg">
            <div className="flex justify-around items-center px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
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
    );
};

export default MobileNav;
