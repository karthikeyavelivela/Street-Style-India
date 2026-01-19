import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2, ShoppingBag } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.variants && data.variants.length > 0) {
                    setSelectedColor(data.variants[0].color);
                    // Automatically select first size of first variant if available
                    if (data.variants[0].sizes && data.variants[0].sizes.length > 0) {
                        setSelectedSize(data.variants[0].sizes[0].size);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select size and color");
            return;
        }
        // In a real app, this would call an API or update global cart context
        // For now, we simulate success
        toast.success("Added to cart!");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    // Helper to find the current variant data
    const currentVariant = product.variants?.find(v => v.color === selectedColor) || product.variants?.[0];

    // Images: Use product global images or variant-specific ones if mapped (assuming global for now based on schema)
    const displayImages = product.images && product.images.length > 0 ? product.images : ["https://via.placeholder.com/600"];

    return (
        <div className="container mx-auto px-4 md:px-8 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-black">Home</Link> /
                <Link to="/shop" className="hover:text-black ml-1">Shop</Link> /
                <span className="text-black font-bold ml-1">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-20 md:h-[600px] no-scrollbar">
                        {displayImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                            >
                                <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100 max-h-[600px]">
                        <img
                            src={displayImages[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {/* Title & Price */}
                    <div className="mb-8">
                        {product.trending && <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">TRENDING</span>}
                        <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight uppercase leading-none">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold">₹{product.price}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-gray-400 line-through">₹{Math.round(product.price * (1 + product.discount / 100))}</span>
                                    <span className="text-red-500 font-bold">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Variants: Color */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <p className="font-bold mb-3 text-sm uppercase">Select Color: <span className="text-gray-500 ml-2">{selectedColor}</span></p>
                            <div className="flex gap-3">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.color}
                                        onClick={() => {
                                            setSelectedColor(variant.color);
                                            // Reset size when color changes if needed, or check stock
                                            if (variant.sizes.length > 0) setSelectedSize(variant.sizes[0].size);
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor === variant.color ? 'border-black' : 'border-transparent'}`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                            style={{ backgroundColor: variant.color.toLowerCase() }} // Ensure valid CSS color or map names to hex
                                            title={variant.color}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Variants: Size */}
                    {currentVariant && currentVariant.sizes && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-bold text-sm uppercase">Select Size: <span className="text-gray-500 ml-2">{selectedSize}</span></p>
                                <button className="text-xs underline text-gray-500 hover:text-black">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {currentVariant.sizes.map((sizeObj) => (
                                    <button
                                        key={sizeObj.size}
                                        onClick={() => setSelectedSize(sizeObj.size)}
                                        disabled={sizeObj.stock === 0}
                                        className={`py-3 rounded-lg border font-bold text-sm transition-all
                                            ${selectedSize === sizeObj.size
                                                ? 'border-black bg-black text-white'
                                                : (sizeObj.stock === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 hover:border-black text-black')
                                            }
                                        `}
                                    >
                                        {sizeObj.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center border border-gray-300 rounded-lg w-max">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-3 hover:bg-gray-50 text-gray-600"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-bold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-3 hover:bg-gray-50 text-gray-600"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            className="flex-1 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} /> ADD TO CART
                        </button>

                        <button className="p-3 border border-gray-300 rounded-lg hover:border-black hover:text-primary transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>

                    {/* Info Tabs */}
                    <div className="border-t border-gray-200 pt-8">
                        <div className="flex gap-8 mb-6 border-b border-gray-100 pb-1 overflow-x-auto no-scrollbar">
                            {['description', 'details', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors relative
                                        ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'}
                                    `}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="text-gray-600 leading-relaxed text-sm">
                            {activeTab === 'description' && (
                                <p>{product.description}</p>
                            )}
                            {activeTab === 'details' && (
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Premium Quality Fabric</li>
                                    <li>Machine Washable</li>
                                    <li>Imported</li>
                                </ul>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Star size={32} className="mx-auto text-yellow-500 mb-2" fill="currentColor" />
                                    <p className="font-bold">No reviews yet</p>
                                    <button className="text-primary text-sm underline mt-2">Be the first to review</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
