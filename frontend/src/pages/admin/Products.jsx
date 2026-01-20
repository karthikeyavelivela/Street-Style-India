import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Pencil, Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting product');
            }
        }
    };

    const groupedProducts = products.reduce((acc, product) => {
        const cat = product.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    if (loading) return <div>Loading Products...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-xl">
                <div>
                    <h2 className="text-2xl font-black">PRODUCT MANAGEMENT</h2>
                    <p className="text-gray-400">Manage your store inventory across all categories.</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {Object.keys(groupedProducts).length === 0 && (
                <div className="p-8 text-center text-gray-500">No products found.</div>
            )}

            {Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black uppercase tracking-tight">{category}</h3>
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">{items.length} Items</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((product) => (
                            <div key={product._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {!product.isActive && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 font-bold rounded-full text-xs flex items-center gap-1">
                                                <AlertCircle size={12} /> INACTIVE
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg leading-tight">{product.name}</h4>
                                        <span className="font-bold">₹{product.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                                    <div className="flex gap-2 pt-4 border-t border-gray-50">
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-black hover:text-white py-2 rounded font-bold text-sm transition-colors">
                                            <Pencil size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Products;
