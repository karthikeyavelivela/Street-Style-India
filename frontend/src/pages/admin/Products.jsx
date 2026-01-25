import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import { Pencil, Trash2, Plus, AlertCircle, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';

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
    variants: [{ color: '', sizes: [{ size: 'M', stock: 0 }] }]
});

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(buildEmptyProduct());
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products', { params: { includeInactive: true } });
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = () => {
        const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
        // Add default categories if none exist
        const defaultCategories = ['T-Shirts', 'Hoodies', 'Oversized', 'Sweatshirts'];
        const allCategories = [...new Set([...cats, ...defaultCategories])];
        setCategories(allCategories);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [products]);

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
            const payload = {
                ...form,
                images: form.images.split('\n').map((img) => img.trim()).filter(Boolean),
            };

            if (editingProduct?._id) {
                await api.put(`/products/${editingProduct._id}`, payload);
                toast.success('Product updated');
            } else {
                await api.post('/products', payload);
                toast.success('Product created');
            }

            setShowForm(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving product');
        }
    };

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

    const addCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
            toast.success('Category added');
        }
    };

    const deleteCategory = (cat) => {
        if (window.confirm(`Delete category "${cat}"? Products in this category will be moved to "Uncategorized".`)) {
            setCategories(categories.filter(c => c !== cat));
            // Update products with this category
            products.forEach(async (product) => {
                if (product.category === cat) {
                    try {
                        await api.put(`/products/${product._id}`, { ...product, category: 'Uncategorized' });
                    } catch (error) {
                        console.error('Error updating product category:', error);
                    }
                }
            });
            fetchProducts();
            toast.success('Category deleted');
        }
    };

    const updateCategory = (oldCat, newCat) => {
        if (newCat.trim() && !categories.includes(newCat.trim())) {
            setCategories(categories.map(c => c === oldCat ? newCat.trim() : c));
            // Update products with this category
            products.forEach(async (product) => {
                if (product.category === oldCat) {
                    try {
                        await api.put(`/products/${product._id}`, { ...product, category: newCat.trim() });
                    } catch (error) {
                        console.error('Error updating product category:', error);
                    }
                }
            });
            fetchProducts();
            setEditingCategory(null);
            toast.success('Category updated');
        }
    };

    const groupedProducts = useMemo(() => products.reduce((acc, product) => {
        const cat = product.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {}), [products]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-xl">
                <div>
                    <h2 className="text-2xl font-black">PRODUCT MANAGEMENT</h2>
                    <p className="text-gray-400">Manage your store inventory across all categories.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCategoryManager(!showCategoryManager)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        Manage Categories
                    </button>
                    <button
                        onClick={() => openForm(null)}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            {showCategoryManager && (
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-black">Category Management</h3>
                        <button onClick={() => setShowCategoryManager(false)} className="text-gray-500 hover:text-black"><X /></button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                                className="flex-1 border rounded px-3 py-2"
                            />
                            <button onClick={addCategory} className="bg-black text-white px-4 py-2 rounded font-bold">Add</button>
                        </div>
                        {categories.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                <p className="mb-2">No categories found. Add your first category above.</p>
                                <p className="text-sm">Default categories: T-Shirts, Hoodies, Oversized, Sweatshirts</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categories.map((cat) => (
                                    <div key={cat} className="flex items-center gap-2 border rounded p-3">
                                        {editingCategory === cat ? (
                                            <>
                                                <input
                                                    type="text"
                                                    defaultValue={cat}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            updateCategory(cat, e.target.value);
                                                        }
                                                    }}
                                                    className="flex-1 border rounded px-2 py-1 text-sm"
                                                    autoFocus
                                                />
                                                <button onClick={() => setEditingCategory(null)} className="text-gray-500">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="flex-1 font-medium">{cat}</span>
                                                <button onClick={() => setEditingCategory(cat)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                                <button onClick={() => deleteCategory(cat)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                        <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-500 hover:text-black"><X /></button>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={saveProduct}>
                        <div className="space-y-3">
                            <label className="text-sm font-bold">Name</label>
                            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold">Category</label>
                            <select
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                required
                                style={{ 
                                    appearance: 'auto',
                                    WebkitAppearance: 'menulist',
                                    MozAppearance: 'menulist'
                                }}
                            >
                                <option value="" disabled className="text-gray-500">Select Category</option>
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                                    ))
                                ) : (
                                    <>
                                        <option value="T-Shirts">T-Shirts</option>
                                        <option value="Hoodies">Hoodies</option>
                                        <option value="Oversized">Oversized</option>
                                        <option value="Sweatshirts">Sweatshirts</option>
                                    </>
                                )}
                            </select>
                            <input
                                type="text"
                                placeholder="Or type new category"
                                className="w-full border rounded px-3 py-2 text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const newCat = e.target.value.trim();
                                        if (newCat && !categories.includes(newCat)) {
                                            setCategories([...categories, newCat]);
                                            setForm({ ...form, category: newCat });
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
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
                                    <label className="block text-xs font-medium mb-2 text-gray-600">Upload from Device</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const imagePromises = files.map(file => {
                                                return new Promise((resolve) => {
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => resolve(e.target.result);
                                                    reader.readAsDataURL(file);
                                                });
                                            });
                                            Promise.all(imagePromises).then(base64Images => {
                                                const currentImages = form.images ? form.images.split('\n').filter(Boolean) : [];
                                                setForm({ ...form, images: [...currentImages, ...base64Images].join('\n') });
                                            });
                                        }}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Select multiple images</p>
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
                                    <p className="text-xs text-gray-400 mt-1">For Cloudinary: Use cloudinary:// URLs or upload via Cloudinary dashboard</p>
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
                            <h4 className="font-bold">Product Tag</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold mb-2 block">Tag Type</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={form.tag || 'others'}
                                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                                    >
                                        <option value="hot">Hot!</option>
                                        <option value="new">New</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-bold mb-2 block">Tag Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={form.tagColor || '#DC143C'}
                                            onChange={(e) => setForm({ ...form, tagColor: e.target.value })}
                                            className="w-16 h-10 border rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={form.tagColor || '#DC143C'}
                                            onChange={(e) => setForm({ ...form, tagColor: e.target.value })}
                                            className="flex-1 border rounded px-3 py-2"
                                            placeholder="#DC143C"
                                        />
                                    </div>
                                </div>
                            </div>
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
            )}

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
                                <div className="p-6 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg leading-tight">{product.name}</h4>
                                        <span className="font-bold">₹{product.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>

                                    <div className="flex flex-wrap gap-1">
                                        {product.variants?.map((variant) => (
                                            <span key={variant.color} className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: variant.color }}></span>
                                                {variant.color}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                                        <button
                                            onClick={() => openForm(product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-black hover:text-white py-2 rounded font-bold text-sm transition-colors"
                                        >
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
