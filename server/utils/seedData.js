const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ServiceType = require('../models/ServiceType');
const Part = require('../models/Part');
const Labour = require('../models/Labour');

dotenv.config();

const users = [
  {
    name: 'Administrator',
    email: 'admin@apexmotors.com',
    password: 'password123',
    phone: '9876500001',
    role: 'ADMIN',
    address: 'Apex Motors Headquarters, Pune'
  },
  {
    name: 'Vikram Joshi (Service Advisor)',
    email: 'staff@apexmotors.com',
    password: 'password123',
    phone: '9876500002',
    role: 'STAFF',
    address: 'Service Bay 3, Apex Motors Hub'
  },
  {
    name: 'Swaroop Kulkarni',
    email: 'customer@apexmotors.com',
    password: 'password123',
    phone: '9876500003',
    role: 'CUSTOMER',
    address: 'Flat 402, Green Acres, Baner, Pune'
  }
];

const serviceTypes = [
  {
    name: 'General Service',
    description: 'Comprehensive 40-point safety inspection, engine oil & filter replacement, coolant top-up, wash and interior vacuuming.',
    basePrice: 2999,
    estimatedDuration: '3 - 4 Hours',
    isActive: true
  },
  {
    name: 'Oil Change',
    description: 'High-grade synthetic oil replacement, OEM oil filter, drain plug washer check, and vital fluid level top-ups.',
    basePrice: 1499,
    estimatedDuration: '1 - 2 Hours',
    isActive: true
  },
  {
    name: 'Brake Service',
    description: 'Front & rear brake pad thickness measurement, rotor inspection, caliper lubrication, and brake line bleeding.',
    basePrice: 1899,
    estimatedDuration: '2 Hours',
    isActive: true
  },
  {
    name: 'AC Service',
    description: 'Refrigerant pressure evaluation, compressor test, condenser cleaning, and antibacterial cabin vent treatment.',
    basePrice: 1999,
    estimatedDuration: '2 - 3 Hours',
    isActive: true
  },
  {
    name: 'Engine Service',
    description: 'OBD-II scanner diagnosis, throttle body cleaning, spark plug inspection, and fuel delivery check.',
    basePrice: 3499,
    estimatedDuration: '3 - 5 Hours',
    isActive: true
  },
  {
    name: 'Tyre Service',
    description: '3D computerized wheel alignment, automated dynamic wheel balancing, and tyre tread depth measurement.',
    basePrice: 999,
    estimatedDuration: '1 - 2 Hours',
    isActive: true
  },
  {
    name: 'Battery Service',
    description: 'CCA load test, terminal descaling, alternator charging rate verification, and battery health report.',
    basePrice: 499,
    estimatedDuration: '1 Hour',
    isActive: true
  }
];

const parts = [
  {
    name: 'Ceramic Front Brake Pads (Set)',
    partNumber: 'BP-HYU-01',
    category: 'Brakes',
    stockQuantity: 24,
    minimumStock: 6,
    unitPrice: 2450,
    supplier: 'Brembo OEM Certified'
  },
  {
    name: 'Fully Synthetic 5W-30 Engine Oil (4L)',
    partNumber: 'OIL-SYN-5W30',
    category: 'Fluids & Lubricants',
    stockQuantity: 40,
    minimumStock: 10,
    unitPrice: 2850,
    supplier: 'Castrol Edge Professional'
  },
  {
    name: 'High Performance Spin-On Oil Filter',
    partNumber: 'OF-HYU-08',
    category: 'Filters',
    stockQuantity: 35,
    minimumStock: 8,
    unitPrice: 420,
    supplier: 'Mann Filter OEM'
  },
  {
    name: 'Engine Air Intake Filter Element',
    partNumber: 'AF-HYU-12',
    category: 'Filters',
    stockQuantity: 28,
    minimumStock: 5,
    unitPrice: 650,
    supplier: 'Mobis OEM'
  },
  {
    name: 'Cabin AC Activated Carbon Filter',
    partNumber: 'CF-AC-22',
    category: 'Filters',
    stockQuantity: 18,
    minimumStock: 5,
    unitPrice: 780,
    supplier: 'Bosch Automotive'
  },
  {
    name: 'Concentrated Engine Coolant (1L)',
    partNumber: 'CL-PRE-01',
    category: 'Fluids & Lubricants',
    stockQuantity: 30,
    minimumStock: 8,
    unitPrice: 380,
    supplier: 'Total Energies'
  },
  {
    name: 'Laser Iridium Spark Plugs (Pack of 4)',
    partNumber: 'SP-NGK-IR4',
    category: 'Engine Components',
    stockQuantity: 12,
    minimumStock: 4,
    unitPrice: 2200,
    supplier: 'NGK Spark Plugs'
  }
];

const labourList = [
  {
    name: 'Brake Pad Replacement & Caliper Service',
    description: 'De-grease slide pins, pad fitment, rotor cleaning, and hydraulic bleeding.',
    charge: 850,
    estimatedDuration: '1.5 Hours'
  },
  {
    name: 'Comprehensive 40-Point Garage Inspection',
    description: 'Multi-point safety assessment of chassis, underbody, electronics, and suspension.',
    charge: 750,
    estimatedDuration: '1 Hour'
  },
  {
    name: 'Engine Oil Drain & Filter Replacement Labour',
    description: 'Sump plug washer replacement, oil drainage, OEM filter torquing, and fluid reset.',
    charge: 450,
    estimatedDuration: '0.75 Hours'
  },
  {
    name: 'AC Duct Foam Disinfection & Filter Change',
    description: 'High-pressure evaporator cleaning and antibacterial vent treatment.',
    charge: 650,
    estimatedDuration: '1 Hour'
  },
  {
    name: 'Computerized 3D Wheel Alignment & Balancing',
    description: 'Laser alignment, camber-caster adjustment, and high-speed balancing weights.',
    charge: 950,
    estimatedDuration: '1.5 Hours'
  },
  {
    name: 'OBD-II Computer Diagnostic Scan & Calibration',
    description: 'Full ECU fault code scan, live sensor logging, and throttle calibration.',
    charge: 800,
    estimatedDuration: '1 Hour'
  }
];

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_management');
      console.log('[Seed] Connected to MongoDB');
    }

    // Clean up and recreate demo users
    for (const u of users) {
      await User.findOneAndDelete({ email: u.email });
      const created = await User.create(u);
      console.log(`[Seed] Created ${created.role} user: ${created.email}`);
    }

    // Seed Service Types
    for (const st of serviceTypes) {
      await ServiceType.findOneAndUpdate(
        { name: st.name },
        st,
        { upsert: true, new: true }
      );
      console.log(`[Seed] Seeded Service Type: ${st.name} (₹${st.basePrice})`);
    }

    // Seed Spare Parts
    for (const p of parts) {
      await Part.findOneAndUpdate(
        { partNumber: p.partNumber },
        p,
        { upsert: true, new: true }
      );
      console.log(`[Seed] Seeded Part: ${p.name} [${p.partNumber}] (₹${p.unitPrice})`);
    }

    // Seed Labour Services
    for (const l of labourList) {
      await Labour.findOneAndUpdate(
        { name: l.name },
        l,
        { upsert: true, new: true }
      );
      console.log(`[Seed] Seeded Labour: ${l.name} (₹${l.charge})`);
    }

    // Seed Demo Vehicle for Customer
    const Vehicle = require('../models/Vehicle');
    const customerUser = await User.findOne({ email: 'customer@apexmotors.com' });
    if (customerUser) {
      const demoVeh = await Vehicle.findOneAndUpdate(
        { registrationNumber: 'MH12AB1234' },
        {
          customerId: customerUser._id,
          registrationNumber: 'MH12AB1234',
          brand: 'Hyundai',
          model: 'Creta',
          variant: '1.5 SX',
          manufacturingYear: 2022,
          fuelType: 'Petrol',
          currentMileage: 38500,
          vin: 'MALB141CBM001234'
        },
        { upsert: true, new: true }
      );
      console.log(`[Seed] Seeded Demo Vehicle: ${demoVeh.brand} ${demoVeh.model} [${demoVeh.registrationNumber}]`);
    }

    console.log('[Seed] Database initialization complete!');

    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
