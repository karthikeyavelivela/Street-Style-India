const products = [
    {
        name: "Premium Oversized Hoodie",
        category: "Hoodies",
        price: 2499,
        discount: 0,
        description: "High quality cotton oversized hoodie.",
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"],
        variants: [
            {
                color: "Black",
                sizes: [
                    { size: "S", stock: 10 },
                    { size: "M", stock: 15 },
                    { size: "L", stock: 20 },
                ]
            }
        ],
        featured: true,
        trending: true,
        isActive: true
    },
    {
        name: "Street Graphic Tee",
        category: "T-Shirts",
        price: 899,
        discount: 10,
        description: "Urban style graphic printed t-shirt.",
        images: ["https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800"],
        variants: [
            {
                color: "White",
                sizes: [
                    { size: "M", stock: 25 },
                    { size: "L", stock: 30 },
                ]
            }
        ],
        featured: true,
        trending: true,
        isActive: true
    },
];

export default products;
