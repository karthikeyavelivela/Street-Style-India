import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-6">ABOUT US</h1>
                <p className="text-xl text-gray-500 mb-12">Redefining Street Style since 2026.</p>

                {/* Video Section */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-12 relative shadow-2xl">
                    <video
                        className="w-full h-full object-cover opacity-80"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=1600"
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-urban-fashion-model-posing-in-neon-light-39871-large.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-white text-3xl font-bold tracking-widest uppercase bg-black/50 px-6 py-2">The Revoultion</h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center text-left">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1529139574466-a302d2d3f524?auto=format&fit=crop&q=80&w=800"
                            alt="Our Studio"
                            className="rounded-xl shadow-lg w-full h-auto transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Our Story</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Street Style India (SSI) started exactly in <strong>2026</strong> with a singular mission: to bring the raw, authentic energy of the streets to your wardrobe. We believe that fashion is not just about what you wear, but how you express your identity.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Born from the vibrant culture of urban India, we fuse modern aesthetics with comfort. Our designs are bold, our quality is premium, and our vibe is unmatched.
                        </p>
                        <div className="pt-4">
                            <h4 className="font-bold border-l-4 border-black pl-4">"Style that speaks before you do."</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
