import React from 'react';
import { X, Check } from 'lucide-react';

const FilterSection = ({ title, children }) => (
    <div className="border-b border-gray-100 py-6 last:border-0">
        <h3 className="font-bold text-sm uppercase tracking-wider mb-4">{title}</h3>
        {children}
    </div>
);

const Filters = ({ isOpen, onClose, meta, selected, onChange }) => {
    const { categories = [], colors = [], sizes = [], minPrice = 0, maxPrice = 5000 } = meta || {};

    const toggleItem = (key, value) => {
        const current = new Set(selected[key]);
        if (current.has(value)) {
            current.delete(value);
        } else {
            current.add(value);
        }
        onChange(key, Array.from(current));
    };

    return (
        <div className={`
      fixed inset-y-0 left-0 z-50 w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out 
      md:relative md:transform-none md:shadow-none md:w-full md:z-0
      ${(isOpen ?? true) ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
            <div className="h-full overflow-y-auto px-6 py-4 md:p-0 bg-white">
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-1">
                    <FilterSection title="Categories">
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={selected.categories.includes(cat)}
                                            onChange={() => toggleItem('categories', cat)}
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-black peer-checked:border-black transition-colors" />
                                        <Check size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-gray-600 group-hover:text-black transition-colors font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="Price Range">
                        <div className="px-2">
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice || 5000}
                                value={selected.price || maxPrice}
                                onChange={(e) => onChange('price', Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="flex justify-between mt-4">
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded">₹{minPrice}</span>
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white rounded">₹{selected.price}</span>
                            </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Size">
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map((size) => (
                                <label key={size} className="cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={selected.sizes.includes(size)}
                                        onChange={() => toggleItem('sizes', size)}
                                    />
                                    <div className="border border-gray-200 rounded py-2.5 text-center text-sm font-bold text-gray-500 hover:border-black peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-all">
                                        {size}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="Color">
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                                <label key={color} className="cursor-pointer group relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={selected.colors.includes(color)}
                                        onChange={() => toggleItem('colors', color)}
                                    />
                                    <div
                                        className="w-8 h-8 rounded-full border border-gray-200 shadow-sm group-hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                    />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-white px-1.5 py-0.5 rounded pointer-events-none">
                                        {color}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <Check size={14} className="text-white drop-shadow" />
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

