import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, X, Save } from 'lucide-react';
import api from '../../utils/api';

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'custom',
        title: '',
        subtitle: '',
        isActive: true,
        order: 0,
        config: {},
        slides: [],
        categories: [],
        content: '',
        styles: {}
    });

    const sectionTypes = [
        { value: 'hero', label: 'Hero (Carousel)' },
        { value: 'featured-categories', label: 'Featured Categories' },
        { value: 'trending-products', label: 'Trending Products' },
        { value: 'why-choose', label: 'Why Choose SSI' },
        { value: 'new-arrivals', label: 'New Arrivals' },
        { value: 'customer-reviews', label: 'Customer Reviews' },
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'scrolling-text', label: 'Scrolling Text' },
        { value: 'custom', label: 'Custom Section' }
    ];

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const { data } = await api.get('/admin/sections');
                setSections(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sections:', error);
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const handleAdd = () => {
        setFormData({
            type: 'custom',
            title: '',
            subtitle: '',
            isActive: true,
            order: sections.length,
            config: {},
            slides: [],
            categories: [],
            content: '',
            styles: {}
        });
        setShowAddModal(true);
        setEditingSection(null);
    };

    const handleEdit = (section) => {
        setFormData({
            type: section.type || 'custom',
            title: section.title || '',
            subtitle: section.subtitle || '',
            isActive: section.isActive !== undefined ? section.isActive : true,
            order: section.order || 0,
            config: section.config || {},
            slides: section.slides || [],
            categories: section.categories || [],
            content: section.content || '',
            styles: section.styles || {}
        });
        setEditingSection(section);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;
        
        try {
            await api.delete(`/admin/sections/${id}`);
            const { data } = await api.get('/admin/sections');
            setSections(data);
        } catch (error) {
            console.error('Error deleting section:', error);
            alert('Error deleting section');
        }
    };

    const handleMove = async (id, direction) => {
        const index = sections.findIndex(s => s._id === id);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;

        const newSections = [...sections];
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        
        const sectionOrders = newSections.map((s, i) => ({ id: s._id, order: i }));
        
        try {
            await api.put('/admin/sections/reorder', { sectionOrders });
            const { data } = await api.get('/admin/sections');
            setSections(data);
        } catch (error) {
            console.error('Error reordering sections:', error);
            alert('Error reordering sections');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSection) {
                await api.put(`/admin/sections/${editingSection._id}`, formData);
            } else {
                await api.post('/admin/sections', formData);
            }
            setShowAddModal(false);
            const { data } = await api.get('/admin/sections');
            setSections(data);
        } catch (error) {
            console.error('Error saving section:', error);
            alert('Error saving section');
        }
    };

    const addSlide = () => {
        setFormData({
            ...formData,
            slides: [...formData.slides, { title: '', subtitle: '', image: '', cta: 'Shop Now', link: '/shop' }]
        });
    };

    const updateSlide = (index, field, value) => {
        const newSlides = [...formData.slides];
        newSlides[index][field] = value;
        setFormData({ ...formData, slides: newSlides });
    };

    const removeSlide = (index) => {
        setFormData({
            ...formData,
            slides: formData.slides.filter((_, i) => i !== index)
        });
    };

    const addCategory = () => {
        setFormData({
            ...formData,
            categories: [...formData.categories, { title: '', image: '', link: '/shop' }]
        });
    };

    const updateCategory = (index, field, value) => {
        const newCategories = [...formData.categories];
        newCategories[index][field] = value;
        setFormData({ ...formData, categories: newCategories });
    };

    const removeCategory = (index) => {
        setFormData({
            ...formData,
            categories: formData.categories.filter((_, i) => i !== index)
        });
    };

    if (loading) {
        return <div className="text-center py-8">Loading sections...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Home Page Sections</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Section</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Order</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Type</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Title</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sections.map((section, index) => (
                            <tr key={section._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleMove(section._id, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <span className="font-mono text-sm">{section.order}</span>
                                        <button
                                            onClick={() => handleMove(section._id, 'down')}
                                            disabled={index === sections.length - 1}
                                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase">
                                        {section.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">{section.title || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {section.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(section)}
                                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <Edit size={16} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(section._id)}
                                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {sections.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No sections found. Click "Add Section" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-black">
                                {editingSection ? 'Edit Section' : 'Add New Section'}
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Section Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        required
                                    >
                                        {sectionTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Order</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold">Active</label>
                            </div>

                            {/* Hero Slides */}
                            {formData.type === 'hero' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-bold">Hero Slides</label>
                                        <button
                                            type="button"
                                            onClick={addSlide}
                                            className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                                        >
                                            + Add Slide
                                        </button>
                                    </div>
                                    {formData.slides.map((slide, index) => (
                                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold">Slide {index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlide(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Title"
                                                    value={slide.title}
                                                    onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Subtitle"
                                                    value={slide.subtitle}
                                                    onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    value={slide.image}
                                                    onChange={(e) => updateSlide(index, 'image', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CTA Text"
                                                    value={slide.cta}
                                                    onChange={(e) => updateSlide(index, 'cta', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link"
                                                    value={slide.link}
                                                    onChange={(e) => updateSlide(index, 'link', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Featured Categories */}
                            {formData.type === 'featured-categories' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-bold">Categories</label>
                                        <button
                                            type="button"
                                            onClick={addCategory}
                                            className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                                        >
                                            + Add Category
                                        </button>
                                    </div>
                                    {formData.categories.map((category, index) => (
                                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold">Category {index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCategory(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Title"
                                                    value={category.title}
                                                    onChange={(e) => updateCategory(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    value={category.image}
                                                    onChange={(e) => updateCategory(index, 'image', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link"
                                                    value={category.link}
                                                    onChange={(e) => updateCategory(index, 'link', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Custom Content */}
                            {formData.type === 'custom' && (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Content (HTML allowed)</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-bold flex items-center space-x-2"
                                >
                                    <Save size={16} />
                                    <span>Save</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sections;

