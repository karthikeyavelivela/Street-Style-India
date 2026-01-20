import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import TrendingProducts from '../components/home/TrendingProducts';
import WhyChooseSSI from '../components/home/WhyChooseSSI';
import NewArrivals from '../components/home/NewArrivals';
import CustomerReviews from '../components/home/CustomerReviews';
import Newsletter from '../components/home/Newsletter';
import ScrollingText from '../components/home/ScrollingText';

const Home = () => {
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
};

export default Home;
