import dotenv from 'dotenv';
import connectDB from './config/db.js';
import StockAdmin from './models/StockAdmin.js';
import Department from './models/Department.js';

dotenv.config();
connectDB();

const seedStockAdmin = async () => {
    try {
        // Create default Stock Admin with PIN: 123456
        const existingAdmin = await StockAdmin.findOne();
        if (!existingAdmin) {
            await StockAdmin.create({
                pin: '123456',
                name: 'Stock Admin'
            });
            console.log('✅ Stock Admin created with PIN: 123456');
        } else {
            console.log('ℹ️ Stock Admin already exists');
        }

        // Create default departments
        const departments = ['Sales', 'Warehouse', 'Billing', 'Logistics', 'Management'];
        for (const deptName of departments) {
            await Department.findOneAndUpdate(
                { name: deptName },
                { name: deptName, isActive: true },
                { upsert: true, new: true }
            );
        }
        console.log('✅ Default departments created');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
};

seedStockAdmin();




