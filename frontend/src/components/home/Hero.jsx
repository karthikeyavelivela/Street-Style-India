import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = ({ sectionData }) => {
    const videoUrl = "https://res.cloudinary.com/dqwm8wgg8/video/upload/v1770899832/5699539-uhd_3840_2160_24fps_yxr2wp.mp4";
    
    // Use sectionData if available, otherwise use defaults
    const title = sectionData?.title || "Urban Streetwear Redefined";
    const subtitle = sectionData?.subtitle || "New Collection 2025";
    const cta = sectionData?.cta || "Shop Now";
    const link = sectionData?.link || "/shop";

    return (
        <div className="relative w-full overflow-hidden bg-black">
            {/* Video Container - Responsive */}
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 z-10">
                    <div className="transform transition-all duration-700 translate-y-0 opacity-100 max-w-4xl mx-auto">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl md:tracking-[0.3em] font-medium mb-3 sm:mb-4 uppercase text-gray-200">
                            {subtitle}
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 tracking-tighter px-4">
                            {title}
                        </h2>
                        <Link
                            to={link}
                            className="inline-flex items-center bg-primary hover:bg-red-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold tracking-wide transition-all transform hover:scale-105 text-sm sm:text-base"
                        >
                            {cta} <ArrowRight className="ml-2" size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
