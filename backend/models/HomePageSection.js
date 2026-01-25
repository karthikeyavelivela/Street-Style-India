import mongoose from "mongoose";

const homePageSectionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true,
        enum: ['hero', 'featured-categories', 'trending-products', 'why-choose', 'new-arrivals', 'customer-reviews', 'newsletter', 'scrolling-text', 'custom']
    },
    title: { type: String },
    subtitle: { type: String },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    config: { 
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // For hero sections
    slides: [{
        title: String,
        subtitle: String,
        image: String,
        cta: String,
        link: String
    }],
    // For featured categories
    categories: [{
        title: String,
        image: String,
        link: String
    }],
    // For custom content
    content: { type: String },
    styles: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model("HomePageSection", homePageSectionSchema);

