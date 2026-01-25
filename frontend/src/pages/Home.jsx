import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import TrendingProducts from '../components/home/TrendingProducts';
import WhyChooseSSI from '../components/home/WhyChooseSSI';
import NewArrivals from '../components/home/NewArrivals';
import CustomerReviews from '../components/home/CustomerReviews';
import Newsletter from '../components/home/Newsletter';
import ScrollingText from '../components/home/ScrollingText';
import api from '../utils/api';

const Home = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const { data } = await api.get('/sections');
                setSections(data);
            } catch (error) {
                console.error('Error fetching sections:', error);
                // Fallback to default sections if API fails
                setSections([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const renderSection = (section) => {
        if (!section.isActive) return null;

        switch (section.type) {
            case 'hero':
                return <Hero key={section._id} sectionData={section} />;
            case 'featured-categories':
                return <FeaturedCategories key={section._id} sectionData={section} />;
            case 'trending-products':
                return <TrendingProducts key={section._id} sectionData={section} />;
            case 'why-choose':
                return <WhyChooseSSI key={section._id} sectionData={section} />;
            case 'new-arrivals':
                return <NewArrivals key={section._id} sectionData={section} />;
            case 'customer-reviews':
                return <CustomerReviews key={section._id} sectionData={section} />;
            case 'newsletter':
                return <Newsletter key={section._id} sectionData={section} />;
            case 'scrolling-text':
                return <ScrollingText key={section._id} sectionData={section} />;
            case 'custom':
                return (
                    <section 
                        key={section._id} 
                        className="py-20 bg-white"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                );
            default:
                return null;
        }
    };

    // If no sections from API, show default layout
    if (!loading && sections.length === 0) {
        return (
            <>
                <Hero />
                <FeaturedCategories />
                <TrendingProducts />
                <WhyChooseSSI />
                <NewArrivals />
                <CustomerReviews />
                <Newsletter />
                <ScrollingText />
            </>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {sections.map(section => renderSection(section))}
        </>
    );
};

export default Home;
