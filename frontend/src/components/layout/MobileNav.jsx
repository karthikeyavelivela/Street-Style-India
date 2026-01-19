import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, User, FileText, ShoppingCart } from 'lucide-react';

const MobileNav = () => {
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Shop', path: '/shop', icon: ShoppingBag },
        { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: 2 },
        { name: 'Orders', path: '/orders', icon: FileText },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 safe-area-pb">
            <div className="flex justify-between items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                flex flex-col items-center justify-center space-y-1 relative group
                ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}
              `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="relative">
                                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.badge && (
                                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {isActive && (
                                        <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
