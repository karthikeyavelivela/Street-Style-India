import React from 'react';

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "The Rise of Streetwear in India",
            date: "Jan 15, 2026",
            image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=800",
            excerpt: "How urban fashion is taking over the streets of Mumbai and Delhi."
        },
        {
            id: 2,
            title: "Why Oversized Hoodies are Here to Stay",
            date: "Jan 10, 2026",
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
            excerpt: "Comfort meets style in the ultimate wardrobe staple."
        },
        {
            id: 3,
            title: "Style Guide: Monochrome Aesthetics",
            date: "Jan 05, 2026",
            image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800",
            excerpt: "Mastering the art of black and white fashion."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-center mb-12">THE BLOG</h1>
            <div className="grid md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <div key={post.id} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-xl mb-4">
                            <img src={post.image} alt={post.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                        <h3 className="font-bold text-xl mb-2 group-hover:underline">{post.title}</h3>
                        <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
