import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const Filters = ({ isOpen, onClose }) => {
    const [priceRange, setPriceRange] = useState(2500);

    return (
        <div className={`
      fixed inset-y-0 left-0 z-50 w-full md:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:shadow-none md:z-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
            <div className="h-full overflow-y-auto p-6 md:p-0 md:pr-6 md:h-auto">
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h2 className="text-xl font-black">Filters</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Categories</h3>
                    <div className="space-y-3">
                        {['All', 'T-Shirts', 'Hoodies', 'Oversized', 'Pants'].map((cat) => (
                            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={cat === 'All'} />
                                <span className="text-gray-600 group-hover:text-black transition-colors">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600 font-medium">
                        <span>₹0</span>
                        <span>₹{priceRange}</span>
                        <span>₹5000+</span>
                    </div>
                </div>

                {/* Sizes */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <label key={size} className="cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="border border-gray-200 rounded-md py-2 text-center text-sm font-medium hover:border-gray-900 peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-all">
                                    {size}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Color</h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'Black', hex: '#000000' },
                            { name: 'White', hex: '#FFFFFF', border: true },
                            { name: 'Gray', hex: '#808080' },
                            { name: 'Navy', hex: '#000080' },
                            { name: 'Olive', hex: '#808000' },
                            { name: 'Red', hex: '#DC143C' },
                        ].map((color) => (
                            <label key={color.name} className="cursor-pointer group relative">
                                <input type="checkbox" className="sr-only peer" />
                                <div
                                    className={`w-8 h-8 rounded-full ${color.border ? 'border border-gray-300' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <Check size={14} className={color.name === 'White' ? 'text-black' : 'text-white'} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Clear Filters Button */}
                <button className="w-full py-3 border border-gray-300 text-black font-bold text-sm tracking-wider hover:bg-black hover:text-white transition-colors">
                    CLEAR ALL FILTERS
                </button>
            </div>
        </div>
    );
};

export default Filters;
