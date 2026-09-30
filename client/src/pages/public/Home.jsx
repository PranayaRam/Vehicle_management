import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Clock,
  Car,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PenTool,
  Star,
  Award,
  ChevronRight,
  Cpu,
  Layers,
  Check,
  Shield,
  Truck,
  FileCheck
} from 'lucide-react';

const Home = () => {
  const [calcSegment, setCalcSegment] = useState('Sedan');
  const [calcService, setCalcService] = useState('PERIODIC');

  const estimatorData = {
    Hatchback: {
      PERIODIC: { price: '₹2,499', time: '3 Hours', items: ['Engine Synthetic Oil & Filter', 'Air Filter Cleaned', '40-Point Safety Check', 'Complete Exterior Wash'] },
      BRAKES: { price: '₹1,299', time: '1.5 Hours', items: ['Brake Pad Thickness Check', 'Rotor Lathe Skimming', 'DOT-4 Fluid Bleeding', 'Handbrake Calibrated'] },
      AC: { price: '₹1,599', time: '2 Hours', items: ['R134a Gas Pressure Test', 'Condenser Coil Flush', 'Cooling Vent Sanitization', 'Cabin Filter Clean'] },
      FULL_CARE: { price: '₹4,999', time: '5 Hours', items: ['Periodic Service', 'Wheel Alignment & Balancing', 'OBD-II Diagnostics', 'AC Decontamination'] }
    },
    Sedan: {
      PERIODIC: { price: '₹2,999', time: '3.5 Hours', items: ['Engine Synthetic Oil & Filter', 'Air Filter Cleaned', '40-Point Safety Check', 'Complete Exterior Wash'] },
      BRAKES: { price: '₹1,499', time: '2 Hours', items: ['Brake Pad Thickness Check', 'Rotor Lathe Skimming', 'DOT-4 Fluid Bleeding', 'Handbrake Calibrated'] },
      AC: { price: '₹1,899', time: '2 Hours', items: ['R134a Gas Pressure Test', 'Condenser Coil Flush', 'Cooling Vent Sanitization', 'Cabin Filter Clean'] },
      FULL_CARE: { price: '₹5,899', time: '5.5 Hours', items: ['Periodic Service', 'Wheel Alignment & Balancing', 'OBD-II Diagnostics', 'AC Decontamination'] }
    },
    SUV: {
      PERIODIC: { price: '₹3,799', time: '4 Hours', items: ['Heavy-Duty Synthetic Oil & Filter', 'Air Filter Cleaned', '40-Point Safety Check', 'Underbody & Engine Wash'] },
      BRAKES: { price: '₹1,899', time: '2.5 Hours', items: ['Heavy Disc Pad Inspection', 'Rotor Lathe Skimming', 'DOT-4 Fluid Bleeding', 'Caliper Pin Greasing'] },
      AC: { price: '₹2,299', time: '2.5 Hours', items: ['Dual Evaporator Gas Fill', 'Condenser Coil Flush', 'Antibacterial Sanitization', 'Cabin Pollen Filter'] },
      FULL_CARE: { price: '₹7,499', time: '6 Hours', items: ['Full Periodic Service', '4-Wheel 3D Laser Alignment', 'Suspension & Bush Check', 'AC Deep Service'] }
    },
    Luxury: {
      PERIODIC: { price: '₹6,499', time: '4.5 Hours', items: ['OEM European Spec Synthetic Oil', 'OEM Oil & Fuel Filter', 'OBD-II Diagnostic Scan', 'Executive Interior Spa'] },
      BRAKES: { price: '₹3,499', time: '3 Hours', items: ['Ceramic Pad Fitment', 'Electronic Caliper Reset', 'DOT 5.1 Fluid Bleed', 'Rotor Thickness Micrometer'] },
      AC: { price: '₹3,999', time: '3 Hours', items: ['Multi-Zone Climate Diagnostics', 'Compressor Health Test', 'Ozone Odor Purifier', 'HEPA Cabin Filter'] },
      FULL_CARE: { price: '₹12,999', time: '7 Hours', items: ['Master Executive Service', 'Diagnostic ECU Live Scan', 'Air Suspension Calibrate', 'Full Detailing Sealant'] }
    }
  };

  const currentEst = estimatorData[calcSegment][calcService];
  const workflowSteps = [
    { num: '01', title: 'Customer Booking', desc: 'Select your vehicle, pick a convenient time slot and state any problems.' },
    { num: '02', title: 'Vehicle Check-In', desc: 'Staff logs odometer, fuel level, initial damages and customer remarks.' },
    { num: '03', title: 'Multi-Point Inspection', desc: 'Engine, brakes, tyres, AC, and fluids checked for condition & safety.' },
    { num: '04', title: 'Parts & Labour Estimate', desc: 'Automated itemized cost estimate prepared with zero hidden charges.' },
    { num: '05', title: 'Digital Approval', desc: 'Customer reviews and approves or rejects the estimate before work begins.' },
    { num: '06', title: 'Service Execution', desc: 'Certified technicians carry out authorized maintenance and repairs.' },
    { num: '07', title: 'Quality Assurance', desc: 'Rigorous road test and checklist inspection before delivery sign-off.' },
    { num: '08', title: 'Invoice & Delivery', desc: 'Transparent digital invoice, multiple payment methods, and vehicle handover.' }
  ];

  const serviceCategories = [
    {
      title: 'Periodic Maintenance',
      desc: 'Manufacturer scheduled general servicing, synthetic oil, filter replacements, and 40-point safety checks.',
      icon: Wrench,
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80',
      tag: 'Every 10,000 km'
    },
    {
      title: 'Brake System Overhaul',
      desc: 'Disc resurfacing, ceramic pad replacement, caliper lubrication, and ABS hydraulic diagnostics.',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1774066811788-8b9ae29ae09d?auto=format&fit=crop&w=800&q=80',
      tag: 'Safety Critical'
    },
    {
      title: 'Climate Control (AC)',
      desc: 'Refrigerant leak detection, compressor maintenance, condenser flush, and cabin air purification.',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      tag: 'Seasonal Care'
    },
    {
      title: 'Engine & Transmission',
      desc: 'OBD-II computer diagnostics, spark plugs, timing belt check, clutch overhaul, and dyno tuning.',
      icon: PenTool,
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
      tag: 'High Precision'
    },
    {
      title: 'Suspension & Steering',
      desc: 'Shock absorber testing, 3D laser wheel alignment, camber balancing, and steering rack inspection.',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
      tag: 'Smooth Ride'
    },
    {
      title: 'Battery & Electricals',
      desc: 'Cold Cranking Amps load testing, alternator health, wiring checks, fuse replacement, and starter service.',
      icon: Clock,
      image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=800&q=80',
      tag: 'Quick Turnaround'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Varma',
      vehicle: 'Hyundai Creta 1.5 SX',
      rating: 5,
      comment: 'The digital estimate approval before touching the car is a total game changer. I knew the exact cost down to every bolt before agreeing.',
      date: 'Serviced 2 weeks ago'
    },
    {
      name: 'Ananya Sharma',
      vehicle: 'Honda City i-VTEC',
      rating: 5,
      comment: 'Real-time job tracking gave me complete peace of mind while at work. Inspection report with photos and condition ratings was remarkably professional.',
      date: 'Serviced 1 month ago'
    },
    {
      name: 'Vikramaditya Rao',
      vehicle: 'Tata Harrier XZA+',
      rating: 5,
      comment: 'OEM genuine parts, transparent labor rates, and the car was handed over right on schedule. Best automobile service facility in the city.',
      date: 'Serviced 3 days ago'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles size={15} className="text-highlight" />
              <span>Certified Multi-Brand Automobile Workshop</span>
            </div>
            <h1 className="hero-title">
              Precision Vehicle Care With <span className="highlight-text">Zero Guesswork</span>
            </h1>
            <p className="hero-subtitle">
              Experience transparent vehicle servicing with upfront computerized estimates, live workshop status tracking, certified technicians, and genuine OEM parts. Every service requires your explicit approval.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Book Service Appointment <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Track Existing Vehicle
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">12,500+</span>
                <span className="stat-label">Vehicles Serviced</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.4%</span>
                <span className="stat-label">On-Time Delivery</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Pre-Approved Estimates</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card" style={{ position: 'relative' }}>
              <div className="rating-pill" style={{ position: 'absolute', top: '-14px', right: '-10px', zIndex: 10 }}>
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span>4.9 / 5</span>
                <span className="text-muted font-normal text-[11px]">(1,450+ Verified Reviews)</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Automotive Diagnostic Workshop"
                className="hero-main-img"
              />
              <div className="hero-image-overlay-card">
                <div className="overlay-card-header">
                  <span className="status-pill status-inservice">IN SERVICE</span>
                  <span className="text-muted text-xs font-mono">JOB #SJ-1002</span>
                </div>
                <h3 className="overlay-vehicle-name">Hyundai Creta 1.5 SX</h3>
                <div className="license-plate my-1">
                  <span className="plate-ind">IND</span>
                  <span className="plate-num">MH 12 AB 1234</span>
                </div>
                <div className="hero-progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
                <div className="overlay-card-meta">
                  <span className="text-xs text-muted">Stage: Brake & Fluid Replacement</span>
                  <span className="overlay-price">Est. ₹8,909</span>
                </div>
              </div>

              <div className="hero-tech-badge">
                <ShieldCheck size={20} className="text-success" />
                <div>
                  <strong className="block text-xs text-dark">OEM Certified</strong>
                  <span className="text-[11px] text-muted">40-Point Digital Safety QA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automotive Trust & Assurance Strip */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-box">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="trust-title">100% Genuine OEM Parts</h4>
                <p className="trust-sub">Authorized brand-certified components</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="trust-title">6-Month Service Warranty</h4>
                <p className="trust-sub">Complete coverage on parts & labor</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <FileCheck size={22} />
              </div>
              <div>
                <h4 className="trust-title">Mandatory Customer Sign-Off</h4>
                <p className="trust-sub">Zero hidden charges or surprises</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="trust-title">Doorstep Pickup & Drop</h4>
                <p className="trust-sub">Safe contactless valet vehicle transit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Workflow Section */}
      <section className="workflow-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">End-To-End Lifecycle</span>
            <h2 className="section-title">How Our Transparent Workflow Operates</h2>
            <p className="section-sub">
              From arrival to delivery, every milestone is documented, verified, and customer-approved.
            </p>
          </div>

          <div className="workflow-grid">
            {workflowSteps.map((step) => (
              <div key={step.num} className="workflow-step-card">
                <span className="step-num">{step.num}</span>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Realistic Automotive Images */}
      <section className="services-overview-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Factory-Grade Care</span>
            <h2 className="section-title">Automotive Services & Diagnostics</h2>
            <p className="section-sub">
              High precision diagnostics, manufacturer-grade tooling, and certified master mechanics for all makes and models.
            </p>
          </div>

          <div className="services-grid">
            {serviceCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="service-card group">
                  <div className="service-card-media">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="service-card-img"
                      loading="lazy"
                    />
                    <span className="service-card-badge">{cat.tag}</span>
                  </div>
                  <div className="service-card-content">
                    <div className="service-icon-wrap">
                      <Icon size={20} />
                    </div>
                    <h3 className="service-name">{cat.title}</h3>
                    <p className="service-desc">{cat.desc}</p>
                    <Link to="/services" className="service-link">
                      Explore Details & Pricing <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Service Cost Estimator Widget */}
      <section className="py-12 bg-slate-50 border-t border-b border-border">
        <div className="container max-w-4xl">
          <div className="section-header text-center mb-8">
            <span className="section-tag">Instant Transparent Calculation</span>
            <h2 className="section-title">Calculate Your Service Cost In Real Time</h2>
            <p className="section-sub">
              Select your vehicle body category and preferred package to inspect turnaround time and itemized coverage.
            </p>
          </div>

          <div className="estimator-card">
            {/* Step 1: Vehicle Segment */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                1. Select Vehicle Segment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Hatchback', label: 'Hatchback', sub: 'i20, Swift, Polo' },
                  { id: 'Sedan', label: 'Executive Sedan', sub: 'City, Verna, Ciaz' },
                  { id: 'SUV', label: 'Compact / Full SUV', sub: 'Creta, Harrier, XUV' },
                  { id: 'Luxury', label: 'Luxury European', sub: 'BMW, Mercedes, Audi' }
                ].map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => setCalcSegment(seg.id)}
                    className={`segment-btn ${calcSegment === seg.id ? 'active' : ''}`}
                  >
                    <Car size={16} />
                    <div className="text-left">
                      <div>{seg.label}</div>
                      <span className="text-[10px] text-muted block font-normal">{seg.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service Package */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                2. Select Service Package
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'PERIODIC', label: 'General Service', icon: Wrench },
                  { id: 'BRAKES', label: 'Brake Overhaul', icon: ShieldCheck },
                  { id: 'AC', label: 'AC Climate Care', icon: Sparkles },
                  { id: 'FULL_CARE', label: 'Complete Overhaul', icon: PenTool }
                ].map((pkg) => {
                  const Icon = pkg.icon;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setCalcService(pkg.id)}
                      className={`segment-btn ${calcService === pkg.id ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{pkg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculated Output Display */}
            <div className="bg-slate-50 rounded-xl p-5 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-muted block mb-1">
                  Estimated Transparent Quote ({calcSegment}):
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-primary font-mono">{currentEst.price}</span>
                  <span className="text-xs text-muted font-mono flex items-center gap-1">
                    <Clock size={13} /> {currentEst.time}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                  {currentEst.items.map((item, idx) => (
                    <span key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" /> {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto">
                <Link to="/customer/book" className="btn btn-primary btn-lg w-full md:w-auto flex items-center justify-center gap-2">
                  <span>Book This Service</span>
                  <ArrowRight size={16} />
                </Link>
                <span className="text-[11px] text-muted text-center block mt-1.5">
                  100% digital approval before service
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us & Credential Access */}
      <section className="why-us-section">
        <div className="container why-grid">
          <div>
            <span className="section-tag">The Apex Standard</span>
            <h2 className="section-title">Why Discerning Motorists Choose Apex Motors</h2>
            <p className="section-sub mb-4">
              We eliminated the mystery and frustration of traditional garages. Zero surprise bills, zero unauthorized part replacements.
            </p>
            <ul className="why-list">
              <li>
                <div className="why-list-icon">
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <div>
                  <strong>Mandatory Customer Estimate Approval</strong>
                  <p className="text-muted text-sm">We never turn a wrench without your upfront digital sign-off on parts and labour.</p>
                </div>
              </li>
              <li>
                <div className="why-list-icon">
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <div>
                  <strong>Certified Multi-Point Inspection</strong>
                  <p className="text-muted text-sm">Clear classification of vehicle safety into Good, Needs Attention, and Critical.</p>
                </div>
              </li>
              <li>
                <div className="why-list-icon">
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <div>
                  <strong>Genuine OEM Spare Parts & Inventory Control</strong>
                  <p className="text-muted text-sm">Live parts stock tracking prevents sub-standard counterfeit component usage.</p>
                </div>
              </li>
              <li>
                <div className="why-list-icon">
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <div>
                  <strong>Complete Digital Service History</strong>
                  <p className="text-muted text-sm">Preserve your car resale value with recorded mileage, parts, and invoices.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="why-card-wrap">
            <div className="quick-access-box">
              <div className="quick-access-header">
                <Award size={22} className="text-highlight" />
                <div>
                  <h3>Demonstration Credentials</h3>
                  <p className="text-xs text-muted">Test all role portals with pre-configured accounts:</p>
                </div>
              </div>
              <div className="demo-creds-list">
                <div className="cred-badge">
                  <span className="cred-role">CUSTOMER PORTAL</span>
                  <code>customer@apexmotors.com / password123</code>
                </div>
                <div className="cred-badge">
                  <span className="cred-role">STAFF PORTAL</span>
                  <code>staff@apexmotors.com / password123</code>
                </div>
                <div className="cred-badge">
                  <span className="cred-role">ADMIN PORTAL</span>
                  <code>admin@apexmotors.com / password123</code>
                </div>
              </div>
              <Link to="/login" className="btn btn-primary btn-block mt-4">
                Launch Portal Login <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Verified Feedback</span>
            <h2 className="section-title">What Vehicle Owners Say</h2>
            <p className="section-sub">
              Over 12,500 car owners trust our digital workshop transparency and technical precision.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
                <p className="testimonial-comment">"{t.comment}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="author-name">{t.name}</h4>
                    <span className="author-vehicle">{t.vehicle}</span>
                    <span className="author-date">{t.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-text">
              <h2>Ready For A Better Car Servicing Experience?</h2>
              <p>Book your multi-point vehicle inspection today and receive a transparent digital estimate with zero obligation.</p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Book Service Appointment <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Contact Workshop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
