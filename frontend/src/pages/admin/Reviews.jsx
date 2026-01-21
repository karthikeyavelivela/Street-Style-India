import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Trash2, EyeOff, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/reviews', { params: { status: 'all' } });
            setReviews(data);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const toggleStatus = async (review) => {
        try {
            await api.put(`/reviews/${review._id}`, { status: review.status === 'published' ? 'hidden' : 'published' });
            toast.success('Review status updated');
            fetchReviews();
        } catch (error) {
            toast.error('Could not update review');
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Could not delete review');
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-xl font-black mb-4">Customer Reviews</h3>
                {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
                <div className="space-y-3">
                    {reviews.map((rev) => (
                        <div key={rev._id} className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">
                                    {rev.name?.slice(0, 2) || 'RV'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{rev.name}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{rev.rating} ★</span>
                                        <span className="text-xs text-gray-500">{rev.productId?.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{rev.comment}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${rev.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {rev.status}
                                </span>
                                <button onClick={() => toggleStatus(rev)} className="px-3 py-2 border rounded text-sm flex items-center gap-1">
                                    {rev.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />} {rev.status === 'published' ? 'Hide' : 'Publish'}
                                </button>
                                <button onClick={() => deleteReview(rev._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;

