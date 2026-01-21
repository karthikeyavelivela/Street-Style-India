import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
    const productId = product._id || product.id;
    return (
        <div className="group relative">
            <Link to={`/product/${productId}`} className="block relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
                {/* Product Tag */}
                {product.tag && product.tag !== 'others' && (
                    <span
                        className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded z-10 uppercase"
                        style={{ backgroundColor: product.tagColor || '#DC143C' }}
                    >
                        {product.tag === 'hot' ? 'Hot!' : product.tag === 'new' ? 'New' : ''}
                    </span>
                )}
                {/* Discount Badge */}
                {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">
                        -{product.discount}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-800 hover:text-primary hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-300">
                    <Heart size={18} />
                </button>

                {/* Images */}
                <img
                    src={product.image1 || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-opacity duration-500 group-hover:opacity-0"
                />
                <img
                    src={product.image2 || product.images?.[1] || product.image1 || product.images?.[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Action Buttons Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center space-x-2">
                    <button className="bg-white text-black hover:bg-primary hover:text-white p-3 rounded-full shadow-lg transition-colors" title="Quick View">
                        <Eye size={18} />
                    </button>
                    <button className="bg-white text-black hover:bg-primary hover:text-white p-3 rounded-full shadow-lg transition-colors" title="Add to Cart">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </Link>

            <div className="mt-4">
                <h3 className="text-sm text-gray-700 font-medium truncate">
                    <Link to={`/product/${productId}`}>{product.name}</Link>
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            ₹{Math.round(product.price * (100 / (100 - product.discount)))}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
