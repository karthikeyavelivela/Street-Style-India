import React from 'react';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24 md:pt-28 pb-8 md:pb-12 min-h-[80vh]">
                {children}
            </main>
            <Footer />
            <MobileNav />
        </div>
    );
};

export default Layout;
