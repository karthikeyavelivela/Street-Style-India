import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Search } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', discount: 0, stock: 0, description: '', image: ''
    });

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Basic transformation to match backend schema. 
            // In a real app, handle variants and file uploads properly.
            const payload = {
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                discount: Number(formData.discount),
                description: formData.description,
                images: [formData.image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"], // Fallback image
                variants: [
                    {
                        color: "Black", // Default variant
                        sizes: [
                            { size: "M", stock: Number(formData.stock) }
                        ]
                    }
                ]
            };

            await api.post('/products', payload);
            toast.success("Product Added Successfully!");
            setIsAdding(false);
            fetchProducts(); // Refresh list
            // Reset form
            setFormData({ name: '', category: '', price: '', discount: 0, stock: 0, description: '', image: '' });

        } catch (error) {
            toast.error("Failed to add product");
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                toast.success("Product Deleted");
                fetchProducts();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    }

    if (loading && !isAdding) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {!isAdding ? (
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl font-black">All Products ({products.length})</h2>
                        <div className="flex w-full md:w-auto gap-4">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800"
                            >
                                <Plus size={18} /> Add Product
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="py-4 px-4 font-bold text-gray-500">Product Name</th>
                                    <th className="py-4 px-4 font-bold text-gray-500">Category</th>
                                    <th className="py-4 px-4 font-bold text-gray-500">Price</th>
                                    <th className="py-4 px-4 font-bold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                                                <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            {product.name}
                                        </td>
                                        <td className="py-4 px-4">{product.category}</td>
                                        <td className="py-4 px-4 font-bold">₹{product.price}</td>
                                        <td className="py-4 px-4">
                                            <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black">Add New Product</h2>
                        <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Product Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="e.g. Urban Hoodie" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Price (₹)</label>
                                    <input name="price" value={formData.price} onChange={handleChange} required type="number" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Discount (%)</label>
                                    <input name="discount" value={formData.discount} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3">
                                    <option value="">Select Category</option>
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Oversized">Oversized</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Image URL</label>
                                <input name="image" value={formData.image} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Stock</label>
                                <input name="stock" value={formData.stock} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800">
                                Save Product
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Products;
