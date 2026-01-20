const products = [
    // Hoodies
    {
        name: "Premium Oversized Hoodie",
        category: "Hoodies",
        price: 2499,
        discount: 0,
        description: "High quality cotton oversized hoodie.",
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Black", sizes: [{ size: "S", stock: 10 }, { size: "M", stock: 15 }] }],
        featured: true, trending: true, isActive: true
    },
    {
        name: "Essential Beige Hoodie",
        category: "Hoodies",
        price: 2199,
        discount: 10,
        description: "Soft fleece hoodie for everyday comfort.",
        images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Beige", sizes: [{ size: "M", stock: 20 }, { size: "L", stock: 20 }] }],
        featured: false, trending: false, isActive: true
    },
    // T-Shirts
    {
        name: "Street Graphic Tee",
        category: "T-Shirts",
        price: 899,
        discount: 10,
        description: "Urban style graphic printed t-shirt.",
        images: ["https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "White", sizes: [{ size: "M", stock: 25 }, { size: "L", stock: 30 }] }],
        featured: true, trending: true, isActive: true
    },
    {
        name: "Vintage Wash Tee",
        category: "T-Shirts",
        price: 999,
        discount: 0,
        description: "Vintage wash finish for a retro look.",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Grey", sizes: [{ size: "S", stock: 15 }, { size: "XL", stock: 10 }] }],
        featured: false, trending: true, isActive: true
    },
    // Oversized
    {
        name: "Oversized Drop Shoulder",
        category: "Oversized",
        price: 1299,
        discount: 0,
        description: "Drop shoulder fit for ultimate relaxation.",
        images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Olive", sizes: [{ size: "M", stock: 30 }, { size: "L", stock: 25 }] }],
        featured: true, trending: false, isActive: true
    },
    {
        name: "Boxy Fit Oversized",
        category: "Oversized",
        price: 1499,
        discount: 15,
        description: "Structured boxy fit oversized tee.",
        images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Black", sizes: [{ size: "L", stock: 20 }, { size: "XL", stock: 20 }] }],
        featured: false, trending: true, isActive: true
    },
    // Sweatshirts
    {
        name: "Classic Crewneck",
        category: "Sweatshirts",
        price: 1999,
        discount: 5,
        description: "Classic crewneck sweatshirt.",
        images: ["https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Navy", sizes: [{ size: "M", stock: 15 }, { size: "L", stock: 15 }] }],
        featured: true, trending: false, isActive: true
    },
    {
        name: "Logo Embroidery Sweatshirt",
        category: "Sweatshirts",
        price: 2299,
        discount: 0,
        description: "Premium sweatshirt with embroidered logo.",
        images: ["https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&q=80&w=800"],
        variants: [{ color: "Grey", sizes: [{ size: "S", stock: 10 }, { size: "M", stock: 20 }] }],
        featured: false, trending: true, isActive: true
    }
];

export default products;
