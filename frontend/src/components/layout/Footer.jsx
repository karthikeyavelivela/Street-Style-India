import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-24 md:pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-black tracking-tighter text-white mb-4">SSI</h2>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Street Style India — Where Street Meets Style.
                            Premium quality streetwear curated by Karthik & Harsha.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Explore</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Fashion Blog</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Support</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Get in Touch</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-3 mt-1 flex-shrink-0" />
                                <span>Indiranagar, Bangalore,<br />Karnataka, India 560038</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-3 flex-shrink-0" />
                                <span>support@streetstyleindia.com</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-3 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© 2025 Street Style India. All rights reserved.</p>
                    <div className="mt-4 md:mt-0">
                        <span className="mr-2">Trusted Payments:</span>
                        Visa • Mastercard • UPI • Razorpay
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
