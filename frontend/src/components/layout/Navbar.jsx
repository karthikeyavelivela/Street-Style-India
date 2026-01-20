import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 shadow-sm' : 'py-6'}`}
            style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: scrolled ? '1px solid rgba(229, 231, 235, 0.5)' : 'none'
            }}
        >
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-3 items-center">

                {/* Left: Navigation (Desktop) & Menu (Mobile) */}
                <div className="flex justify-start">
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
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Center: Brand Name */}
                <div className="flex justify-center">
                    <Link to="/" className="group flex flex-col items-center relative z-50">
                        <h1 className="text-xl md:text-3xl font-black tracking-[0.2em] transition-colors text-black uppercase whitespace-nowrap" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Street Style India
                        </h1>
                        <span className="text-[10px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-1 text-secondary">
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
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                            2
                        </span>
                    </Link>

                    {/* Profile */}
                    <Link to="/profile" className="hidden md:block">
                        <User size={20} className="text-gray-800 hover:text-primary transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
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
    );
};

export default Navbar;
