import React from 'react';

const ScrollingText = () => {
    return (
        <div className="bg-black py-4 overflow-hidden whitespace-nowrap border-t border-gray-800">
            <div className="inline-flex animate-scroll">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="text-white font-black text-4xl md:text-6xl mx-8 uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        STREET STYLE INDIA
                    </span>
                ))}
            </div>
            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ScrollingText;
