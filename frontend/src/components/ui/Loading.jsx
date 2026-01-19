import React, { useEffect, useState } from 'react';

const Loading = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        // Fade in
        setTimeout(() => setOpacity(1), 100);

        // Initial wait + fade out start
        const timer1 = setTimeout(() => {
            setOpacity(0);
        }, 1500); // Wait 1.5s then fade out

        // Complete
        const timer2 = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 1900); // 1.5s + 0.4s fade out duration

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out"
            style={{ opacity: opacity }}
        >
            <div className="text-center">
                <h1 className="text-5xl font-black tracking-tighter text-black mb-2 font-sans">SSI</h1>
                <p className="text-sm font-medium text-text-secondary tracking-[0.2em] uppercase">by Karthik & Harsha</p>
            </div>
        </div>
    );
};

export default Loading;
