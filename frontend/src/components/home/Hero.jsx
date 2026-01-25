import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const defaultSlides = [
    {
        id: 1,
        title: "Urban Streetwear Redefined",
        subtitle: "New Collection 2025",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000",
        cta: "Shop Now"
    },
    {
        id: 2,
        title: "Oversized Revolution",
        subtitle: "Maximum Comfort, Maximum Style",
        image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&q=80&w=2000",
        cta: "Explore Oversized"
    },
    {
        id: 3,
        title: "Premium Hoodies",
        subtitle: "For the Cold Nights",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=2000",
        cta: "View Collection"
    }
];

const Hero = ({ sectionData }) => {
    const [current, setCurrent] = useState(0);
    const slides = sectionData?.slides && sectionData.slides.length > 0 
        ? sectionData.slides.map((slide, index) => ({ ...slide, id: index + 1 }))
        : defaultSlides;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[80vh] w-full overflow-hidden bg-black">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                        <div className={`transform transition-all duration-700 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <p className="text-lg md:text-xl md:tracking-[0.3em] font-medium mb-4 uppercase text-gray-200">
                                {slide.subtitle}
                            </p>
                            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                                {slide.title}
                            </h2>
                            <Link
                                to={slide.link || "/shop"}
                                className="inline-flex items-center bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold tracking-wide transition-all transform hover:scale-105"
                            >
                                {slide.cta || "Shop Now"} <ArrowRight className="ml-2" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
