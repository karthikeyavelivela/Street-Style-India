import React from 'react';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-grow pt-24 md:pt-28 pb-20 md:pb-0 min-h-[80vh]">
                {children}
            </main>
            <Footer />
            <MobileNav />
        </div>
    );
};

export default Layout;
