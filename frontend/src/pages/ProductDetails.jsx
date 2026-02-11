import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag } from 'lucide-react';
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
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get('/reviews', { params: { productId: id } });
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [id]);

    const submitReview = async () => {
        if (!user) {
            toast.info("Please login to write a review.");
            return;
        }
        try {
            setSubmitting(true);
            await api.post('/reviews', {
                productId: id,
                rating: reviewRating,
                comment: reviewText
            });
            toast.success("Review submitted");
            setReviewText('');
            const { data } = await api.get('/reviews', { params: { productId: id } });
            setReviews(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const addToCart = async () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select size and color");
            return;
        }
        if (!user) {
            toast.info("Please login to add items to cart");
            return;
        }
        try {
            await api.post('/cart', {
                productId: id,
                quantity,
                size: selectedSize,
                color: selectedColor
            });
            toast.success("Added to cart!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    // Helper to find the current variant data
    const currentVariant = product.variants?.find(v => v.color === selectedColor) || product.variants?.[0];

    // Images: Use product global images or variant-specific ones if mapped (assuming global for now based on schema)
    const displayImages = product.images && product.images.length > 0 ? product.images : ["https://via.placeholder.com/600"];

    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
            {/* Breadcrumb */}
            <div className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 md:mb-8">
                <Link to="/" className="hover:text-black">Home</Link> /
                <Link to="/shop" className="hover:text-black ml-1">Shop</Link> /
                <span className="text-black font-bold ml-1">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-2 sm:gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto md:w-16 lg:w-20 md:h-[400px] lg:h-[600px] no-scrollbar pb-2 md:pb-0">
                        {displayImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 border-2 rounded-lg overflow-hidden transition-all ${selectedImage === index ? 'border-primary scale-105' : 'border-transparent'}`}
                            >
                                <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 max-h-[400px] sm:max-h-[500px] md:max-h-[600px]">
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
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        {product.trending && <span className="bg-primary text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 md:mb-4 inline-block">TRENDING</span>}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 tracking-tight uppercase leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                            <span className="text-xl sm:text-2xl font-bold">₹{product.price}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-gray-400 line-through text-sm sm:text-base">₹{Math.round(product.price * (1 + product.discount / 100))}</span>
                                    <span className="text-red-500 font-bold text-sm sm:text-base">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Variants: Color */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-4 sm:mb-6">
                            <p className="font-bold mb-2 sm:mb-3 text-xs sm:text-sm uppercase">Select Color: <span className="text-gray-500 ml-2">{selectedColor}</span></p>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.color}
                                        onClick={() => {
                                            setSelectedColor(variant.color);
                                            // Reset size when color changes if needed, or check stock
                                            if (variant.sizes.length > 0) setSelectedSize(variant.sizes[0].size);
                                        }}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === variant.color ? 'border-black scale-110' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <div
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200"
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
                        <div className="mb-6 sm:mb-8">
                            <div className="flex justify-between items-center mb-2 sm:mb-3 flex-wrap gap-2">
                                <p className="font-bold text-xs sm:text-sm uppercase">Select Size: <span className="text-gray-500 ml-2">{selectedSize}</span></p>
                                <button className="text-xs underline text-gray-500 hover:text-black whitespace-nowrap">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                                {currentVariant.sizes.map((sizeObj) => (
                                    <button
                                        key={sizeObj.size}
                                        onClick={() => setSelectedSize(sizeObj.size)}
                                        disabled={sizeObj.stock === 0}
                                        className={`py-2 sm:py-3 rounded-lg border font-bold text-xs sm:text-sm transition-all
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
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-max">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="flex-1 sm:w-12 text-center font-bold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            className="w-full sm:flex-1 bg-primary text-white font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /> ADD TO CART
                        </button>
                    </div>

                    {/* Info Tabs */}
                    <div className="border-t border-gray-200 pt-4 sm:pt-6 md:pt-8">
                        <div className="flex gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 border-b border-gray-100 pb-1 overflow-x-auto no-scrollbar">
                            {['description', 'details', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 sm:pb-3 font-bold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap transition-colors relative
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

                        <div className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                            {activeTab === 'description' && (
                                <p className="break-words">{product.description}</p>
                            )}
                            {activeTab === 'details' && (
                                <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                                    <li>Premium Quality Fabric</li>
                                    <li>Machine Washable</li>
                                    <li>Imported</li>
                                </ul>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="space-y-3 sm:space-y-4">
                                    {reviews.length === 0 && (
                                        <div className="text-center py-4 sm:py-6 bg-gray-50 rounded-lg">
                                            <Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-yellow-500 mb-2" fill="currentColor" />
                                            <p className="font-bold text-sm sm:text-base">No reviews yet</p>
                                        </div>
                                    )}

                                    {reviews.map((rev) => (
                                        <div key={rev._id} className="border border-gray-100 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                                                {rev.name?.slice(0, 2) || 'RV'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-xs sm:text-sm">{rev.name}</span>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} sm:size={14} className={i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{rev.comment}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t border-gray-100 pt-3 sm:pt-4">
                                        <h4 className="font-bold mb-2 text-sm sm:text-base">Add your review</h4>
                                        <div className="flex items-center gap-1 sm:gap-2 mb-2">
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setReviewRating(val)}
                                                    className={`p-1 transition-colors ${reviewRating >= val ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    type="button"
                                                >
                                                    <Star size={16} sm:size={18} fill={reviewRating >= val ? 'currentColor' : 'none'} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="w-full border rounded-lg p-2 sm:p-3 text-xs sm:text-sm"
                                            rows={3}
                                            placeholder="Share your thoughts about this product"
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                        <button
                                            onClick={submitReview}
                                            disabled={submitting || !reviewText}
                                            className="mt-2 bg-black text-white px-3 sm:px-4 py-2 rounded font-bold disabled:opacity-50 text-xs sm:text-sm transition-opacity"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
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
