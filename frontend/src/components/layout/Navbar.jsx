import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Navbar = () => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        // Refresh cart count every 10 seconds (reduced frequency)
        const interval = setInterval(fetchCartCount, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            {/* Top Announcement Bar */}
            <div className="fixed top-0 left-0 right-0 bg-black text-white text-center py-0.5 text-[10px] font-medium z-50 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span>

                     <span className="mx-6">Opening Soon !!</span>
                     <span className="mx-6">Opening Soon !!</span>
                      <span className="mx-6">Opening Soon !!</span>
                      <span className="mx-6">Opening Soon !!</span>
                      <span className="mx-6">Opening Soon !!</span>

                      <span className="mx-6">Opening Soon !!</span>

                      <span className="mx-6">Opening Soon !!</span>
                      <span className="mx-6">Opening Soon !!</span>
                      <span className="mx-6">Opening Soon !!</span>
                      <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span>

                       <span className="mx-6">Opening Soon !!</span>    
                    
                    <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span>
                    
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span> <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                    <span className="mx-6">Opening Soon !!</span>
                </div>
            </div>
            <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'py-2 shadow-sm top-[18px]' : 'py-3 top-[18px]'}`}
                style={{
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: scrolled ? '1px solid rgba(229, 231, 235, 0.5)' : 'none'
                }}
            >
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-3 items-center">

                {/* Left: Logo & Navigation (Desktop) */}
                <div className="flex justify-start items-center space-x-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img 
                            src="/logo.png" 
                            alt="Street Style India Logo" 
                            className="h-12 md:h-16 w-auto object-cover"
                            onError={(e) => {
                                // Fallback if logo doesn't exist
                                e.target.style.display = 'none';
                            }}
                        />
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `
                            text-sm font-medium tracking-wide transition-colors hover:text-primary uppercase
                            ${isActive ? 'text-primary' : (scrolled ? 'text-gray-800' : 'text-gray-900')}
                        `}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Center: Brand Name */}
                <div className="flex justify-center">
                    <Link to="/" className="flex flex-col items-center relative z-50">
                        <h1 className="text-xl md:text-3xl font-normal tracking-[0.2em] transition-colors text-black whitespace-nowrap" style={{ fontFamily: 'Satisfy, cursive' }}>
                            Street Style India
                        </h1>
                        <span className="text-[10px] font-medium tracking-widest uppercase absolute top-full mt-1 text-secondary">
                            by Sameer & Indhu
                        </span>
                    </Link>
                </div>

                {/* Right: Icons */}
                <div className="flex justify-end items-center space-x-6">
                    {/* Search */}
                    <div className="relative hidden md:block group">
                        <div className={`flex items-center border rounded-full px-3 py-1 transition-all ${searchOpen ? 'w-64 border-gray-300 bg-white' : 'w-8 border-transparent bg-transparent'}`}>
                            <button onClick={() => setSearchOpen(!searchOpen)} className="focus:outline-none">
                                <Search size={20} className="text-gray-800 hover:text-primary transition-colors" />
                            </button>
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`bg-transparent outline-none ml-2 text-sm w-full ${searchOpen ? 'block' : 'hidden'}`}
                            />
                        </div>
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className="relative group">
                        <ShoppingBag size={20} className="text-gray-800 hover:text-primary transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile */}
                    <Link to="/profile" className="hidden md:block">
                        <User size={20} className="text-gray-800 hover:text-primary transition-colors" />
                    </Link>

                    {/* Mobile Menu Button - Moved to top right */}
                    <button
                        className="md:hidden text-gray-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4 mt-0">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                text-base font-medium tracking-wide transition-colors uppercase py-2 border-b border-gray-50
                                ${isActive ? 'text-primary' : 'text-gray-800'}
                            `}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
        </>
    );
};

export default Navbar;
