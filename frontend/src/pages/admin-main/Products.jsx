import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, AlertCircle, Upload, Loader } from 'lucide-react';
import api from '../../utils/api';
import { uploadImageToCloudinary, uploadMultipleImages } from '../../utils/cloudinary';

const buildEmptyProduct = () => ({
    name: '',
    category: '',
    price: 0,
    discount: 0,
    description: '',
    images: '',
    isActive: true,
    featured: false,
    trending: false,
    tag: 'others',
    tagColor: '#DC143C',
    totalStock: 0,
    onlineSales: 0,
    offlineSales: 0,
    availableStock: 0,
    sku: '',
    variants: [{ color: '', sizes: [{ size: 'M', stock: 0 }] }]
});

const Products = ({ searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(buildEmptyProduct());
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
        const defaultCategories = ['T-Shirts', 'Hoodies', 'Oversized', 'Sweatshirts'];
        setCategories([...new Set([...cats, ...defaultCategories])]);
    }, [products]);

    const fetchProducts = async () => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            const { data } = await api.get('/admin-main/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm(buildEmptyProduct());
        setEditingProduct(null);
    };

    const openForm = (product) => {
        if (product) {
            setEditingProduct(product);
            setForm({
                ...product,
                images: (product.images || []).join('\n'),
                tag: product.tag || 'others',
                tagColor: product.tagColor || '#DC143C',
            });
        } else {
            resetForm();
        }
        setShowForm(true);
    };

    const handleVariantChange = (index, key, value) => {
        const updated = [...form.variants];
        updated[index][key] = value;
        setForm({ ...form, variants: updated });
    };

    const handleSizeChange = (variantIdx, sizeIdx, key, value) => {
        const updated = [...form.variants];
        updated[variantIdx].sizes[sizeIdx][key] = value;
        setForm({ ...form, variants: updated });
    };

    const addVariant = () => {
        setForm({ ...form, variants: [...form.variants, { color: '', sizes: [{ size: 'M', stock: 0 }] }] });
    };

    const addSize = (variantIdx) => {
        const updated = [...form.variants];
        updated[variantIdx].sizes.push({ size: 'M', stock: 0 });
        setForm({ ...form, variants: updated });
    };

    const removeVariant = (variantIdx) => {
        const updated = form.variants.filter((_, idx) => idx !== variantIdx);
        setForm({ ...form, variants: updated.length ? updated : [{ color: '', sizes: [{ size: 'M', stock: 0 }] }] });
    };

    const removeSize = (variantIdx, sizeIdx) => {
        const updated = [...form.variants];
        updated[variantIdx].sizes = updated[variantIdx].sizes.filter((_, idx) => idx !== sizeIdx);
        if (updated[variantIdx].sizes.length === 0) {
            updated[variantIdx].sizes = [{ size: 'M', stock: 0 }];
        }
        setForm({ ...form, variants: updated });
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;

            const payload = {
                ...form,
                images: form.images.split('\n').map((img) => img.trim()).filter(Boolean),
            };

            if (editingProduct?._id) {
                await api.put(`/admin-main/products/${editingProduct._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Product updated');
            } else {
                await api.post('/admin-main/products', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Product created');
            }

            setShowForm(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving product');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
                const token = stockAdminInfo.token;
                
                await api.delete(`/admin-main/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting product');
            }
        }
    };

    const handleStockUpdate = async (productId, action, quantity) => {
        try {
            const stockAdminInfo = JSON.parse(localStorage.getItem('stockAdminInfo') || '{}');
            const token = stockAdminInfo.token;
            
            await api.put(`/admin-main/products/${productId}/stock`, {
                action,
                quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Error updating stock');
        }
    };

    if (loading) return <div className="text-center py-8">Loading Products...</div>;

    const filteredProducts = searchQuery
        ? products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : products;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Product Management</h2>
                <button
                    onClick={() => openForm(null)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-500 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-sm font-bold">Name</label>
                                <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold">Category</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold">Price</label>
                                <input type="number" className="w-full border rounded px-3 py-2" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold">Discount (%)</label>
                                <input type="number" className="w-full border rounded px-3 py-2" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-sm font-bold">Description</label>
                                <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-sm font-bold">Product Images</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium mb-2 text-gray-600">Upload from Device (Direct to Cloudinary)</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={async (e) => {
                                                const files = Array.from(e.target.files);
                                                if (files.length === 0) return;
                                                
                                                setUploadingImages(true);
                                                try {
                                                    const urls = await uploadMultipleImages(files);
                                                    const currentImages = form.images ? form.images.split('\n').filter(Boolean) : [];
                                                    setForm({ ...form, images: [...currentImages, ...urls].join('\n') });
                                                    alert(`${urls.length} image(s) uploaded successfully!`);
                                                } catch (error) {
                                                    alert('Error uploading images: ' + error.message);
                                                } finally {
                                                    setUploadingImages(false);
                                                }
                                            }}
                                            disabled={uploadingImages}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:opacity-50"
                                        />
                                        {uploadingImages && (
                                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                                <Loader size={12} className="animate-spin" />
                                                Uploading to Cloudinary...
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">Select multiple images (JPG, PNG, WEBP - Max 5MB each)</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-2 text-gray-600">Or Enter Image URLs (one per line)</label>
                                        <textarea 
                                            className="w-full border rounded px-3 py-2" 
                                            rows={3} 
                                            value={form.images} 
                                            onChange={(e) => setForm({ ...form, images: e.target.value })} 
                                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                        />
                                    </div>
                                    {form.images && (
                                        <div className="grid grid-cols-3 gap-2 mt-3">
                                            {form.images.split('\n').filter(Boolean).slice(0, 6).map((img, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded border" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const images = form.images.split('\n').filter(Boolean);
                                                            images.splice(idx, 1);
                                                            setForm({ ...form, images: images.join('\n') });
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold">SKU</label>
                                <input type="text" className="w-full border rounded px-3 py-2" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold">Total Stock</label>
                                <input type="number" className="w-full border rounded px-3 py-2" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: Number(e.target.value) })} />
                            </div>
                            <div className="flex items-center gap-4 md:col-span-2 flex-wrap">
                                <label className="flex items-center gap-2 text-sm font-bold">
                                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
                                </label>
                                <label className="flex items-center gap-2 text-sm font-bold">
                                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
                                </label>
                                <label className="flex items-center gap-2 text-sm font-bold">
                                    <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Trending
                                </label>
                            </div>
                            <div className="md:col-span-2 space-y-3 border rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold">Variants (Color & Sizes)</h4>
                                    <button type="button" onClick={addVariant} className="text-sm font-bold text-primary">Add Variant</button>
                                </div>
                                <div className="space-y-4">
                                    {form.variants.map((variant, idx) => (
                                        <div key={idx} className="border rounded-lg p-3 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold">Color</span>
                                                    <input className="border rounded px-2 py-1" value={variant.color} onChange={(e) => handleVariantChange(idx, 'color', e.target.value)} required />
                                                </div>
                                                <button type="button" onClick={() => removeVariant(idx)} className="text-xs text-red-500">Remove</button>
                                            </div>
                                            <div className="space-y-2">
                                                {variant.sizes.map((sizeObj, sIdx) => (
                                                    <div key={sIdx} className="flex gap-2 items-center">
                                                        <input className="border rounded px-2 py-1 w-20" value={sizeObj.size} onChange={(e) => handleSizeChange(idx, sIdx, 'size', e.target.value)} />
                                                        <input type="number" className="border rounded px-2 py-1 w-24" value={sizeObj.stock} onChange={(e) => handleSizeChange(idx, sIdx, 'stock', Number(e.target.value))} />
                                                        <button type="button" onClick={() => removeSize(idx, sIdx)} className="text-xs text-red-500">Remove</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => addSize(idx)} className="text-xs font-bold text-primary">Add Size</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-black text-white rounded font-bold">{editingProduct ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Product</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Price</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Total Stock</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Online Sales</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Offline Sales</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Available</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {product.images && product.images[0] && (
                                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                        )}
                                        <div>
                                            <div className="font-bold">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold">₹{product.price}</div>
                                    {product.discount > 0 && (
                                        <div className="text-xs text-green-600">-{product.discount}%</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">{product.totalStock || 0}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-blue-600">{product.onlineSales || 0}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-purple-600">{product.offlineSalesTotal || product.offlineSales || 0}</div>
                                    {product.offlineRevenueTotal > 0 && (
                                        <div className="text-xs text-gray-500">₹{product.offlineRevenueTotal.toLocaleString()}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${(product.availableStock || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                        {product.availableStock || 0}
                                    </span>
                                    {(product.availableStock || 0) < 10 && (
                                        <AlertCircle size={14} className="inline-block ml-1 text-red-600" />
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openForm(product)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Edit Product"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    const qty = prompt('Enter quantity to add stock:');
                                                    if (qty) handleStockUpdate(product._id, 'add', parseInt(qty));
                                                }}
                                                className="text-green-600 hover:text-green-800 text-xs font-bold px-2 py-1 border border-green-600 rounded"
                                                title="Add Stock"
                                            >
                                                + Stock
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const qty = prompt('Enter quantity sold offline:');
                                                    if (qty) handleStockUpdate(product._id, 'offline_sale', parseInt(qty));
                                                }}
                                                className="text-purple-600 hover:text-purple-800 text-xs font-bold px-2 py-1 border border-purple-600 rounded"
                                                title="Record Offline Sale"
                                            >
                                                + Sale
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No products found</div>
                )}
            </div>
        </div>
    );
};

export default Products;
