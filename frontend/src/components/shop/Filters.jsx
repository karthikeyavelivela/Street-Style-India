import React, { useState } from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';

const Filters = ({ isOpen, onClose }) => {
    const [priceRange, setPriceRange] = useState(2500);

    // Section Component
    const FilterSection = ({ title, children }) => (
        <div className="border-b border-gray-100 py-6 last:border-0">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className={`
      fixed inset-y-0 left-0 z-50 w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out 
      md:relative md:transform-none md:shadow-none md:w-full md:z-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
            <div className="h-full overflow-y-auto px-6 py-4 md:p-0 bg-white">
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-1">
                    {/* Categories */}
                    <FilterSection title="Categories">
                        <div className="space-y-3">
                            {['All', 'T-Shirts', 'Hoodies', 'Oversized', 'Pants', 'Sweatshirts'].map((cat) => (
                                <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="peer sr-only" defaultChecked={cat === 'All'} />
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-black peer-checked:border-black transition-colors" />
                                        <Check size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-gray-600 group-hover:text-black transition-colors font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Price Range */}
                    <FilterSection title="Price Range">
                        <div className="px-2">
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="flex justify-between mt-4">
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded">₹0</span>
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white rounded">₹{priceRange}</span>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Sizes */}
                    <FilterSection title="Size">
                        <div className="grid grid-cols-3 gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                <label key={size} className="cursor-pointer group">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="border border-gray-200 rounded py-2.5 text-center text-sm font-bold text-gray-500 hover:border-black peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-all">
                                        {size}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Colors */}
                    <FilterSection title="Color">
                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: 'Black', hex: '#000000' },
                                { name: 'White', hex: '#FFFFFF', border: true },
                                { name: 'Gray', hex: '#808080' },
                                { name: 'Navy', hex: '#000080' },
                                { name: 'Olive', hex: '#808000' },
                                { name: 'Red', hex: '#DC143C' },
                                { name: 'Beige', hex: '#F5F5DC', border: true },
                            ].map((color) => (
                                <label key={color.name} className="cursor-pointer group relative">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div
                                        className={`w-8 h-8 rounded-full ${color.border ? 'border border-gray-200' : ''} shadow-sm group-hover:scale-110 transition-transform`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-white px-1.5 py-0.5 rounded pointer-events-none`}>
                                        {color.name}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <Check size={14} className={color.name === 'White' || color.name === 'Beige' ? 'text-black' : 'text-white'} />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                </div>
            </div>
        </div>
    );
};

export default Filters;

