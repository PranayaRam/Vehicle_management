import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Clock,
  Car,
  CheckCircle2,
  ArrowRight,
  FileText,
  DollarSign,
  Truck,
  Sparkles,
  Search,
  PenTool
} from 'lucide-react';

const Home = () => {
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
    { title: 'Periodic Maintenance', desc: 'Manufacturer scheduled general servicing, synthetic oil, filter replacements, and safety checks.', icon: Wrench },
    { title: 'Brake System Overhaul', desc: 'Disc resurfacing, ceramic pad replacement, caliper lubrication, and ABS hydraulic diagnostics.', icon: ShieldCheck },
    { title: 'Climate Control (AC)', desc: 'Refrigerant leak detection, compressor maintenance, condenser flush, and cabin air purification.', icon: Sparkles },
    { title: 'Engine & Transmission', desc: 'OBD-II computer diagnostics, spark plugs, timing belt check, clutch overhaul, and tuning.', icon: PenTool },
    { title: 'Suspension & Steering', desc: 'Shock absorber testing, wheel alignment, camber balancing, and steering rack inspection.', icon: Car },
    { title: 'Battery & Electricals', desc: 'Load testing, alternator health, wiring checks, fuse replacement, and starter motor service.', icon: Clock }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles size={14} className="text-primary" />
              <span>Transparent Automobile Service Management</span>
            </div>
            <h1 className="hero-title">
              Professional Vehicle Servicing With <span className="highlight-text">Zero Guesswork</span>
            </h1>
            <p className="hero-subtitle">
              Professional vehicle servicing with transparent estimates, live job status tracking, OEM parts, and reliable delivery. Every step requires your approval before work begins.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Book Service Appointment <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
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
            <div className="hero-card shadow-lg">
              <div className="hero-card-header">
                <span className="status-pill status-inservice">IN SERVICE</span>
                <span className="text-muted text-xs">Job #SJ-1002</span>
              </div>
              <h3 className="hero-card-vehicle">Hyundai Creta 1.5 SX</h3>
              <p className="hero-card-reg">Reg: MH 12 AB 1234</p>
              <div className="hero-progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="hero-card-meta">
                <span>Phase: Brake & Fluid Replacement</span>
                <span className="font-semibold text-primary">Est. ₹8,909</span>
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

      {/* Services Section */}
      <section className="services-overview-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Comprehensive Workshop</span>
            <h2 className="section-title">Automotive Services & Diagnostics</h2>
            <p className="section-sub">High precision tooling and qualified mechanics for all car brands.</p>
          </div>

          <div className="services-grid">
            {serviceCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="service-card">
                  <div className="service-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <h3 className="service-name">{cat.title}</h3>
                  <p className="service-desc">{cat.desc}</p>
                  <Link to="/services" className="service-link">
                    Explore Details <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us-section">
        <div className="container why-grid">
          <div>
            <span className="section-tag">The Apex Advantage</span>
            <h2 className="section-title">Why Motorists Rely On Apex Motors</h2>
            <p className="section-sub mb-4">
              We eliminated the mystery of automotive maintenance. No unexpected charges, no unapproved replacements.
            </p>
            <ul className="why-list">
              <li>
                <CheckCircle2 size={20} className="text-success" />
                <div>
                  <strong>Mandatory Customer Estimate Approval</strong>
                  <p className="text-muted text-sm">We never turn a wrench without your upfront digital sign-off on parts and labour.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 size={20} className="text-success" />
                <div>
                  <strong>Certified Multi-Point Inspection</strong>
                  <p className="text-muted text-sm">Clear classification of vehicle safety into Good, Needs Attention, and Critical.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 size={20} className="text-success" />
                <div>
                  <strong>Genuine OEM Spare Parts & Inventory Control</strong>
                  <p className="text-muted text-sm">Live parts stock tracking prevents sub-standard component usage.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 size={20} className="text-success" />
                <div>
                  <strong>Complete Digital Service History</strong>
                  <p className="text-muted text-sm">Preserve your car resale value with recorded mileage, parts, and invoices.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="why-card-wrap">
            <div className="quick-access-box">
              <h3>Demonstration Credentials</h3>
              <p className="text-sm text-muted mb-3">Pre-configured demo accounts for assessment testing:</p>
              <div className="demo-creds-list">
                <div className="cred-badge">
                  <strong>Customer:</strong> customer@apexmotors.com / password123
                </div>
                <div className="cred-badge">
                  <strong>Staff:</strong> staff@apexmotors.com / password123
                </div>
                <div className="cred-badge">
                  <strong>Admin:</strong> admin@apexmotors.com / password123
                </div>
              </div>
              <Link to="/login" className="btn btn-primary btn-block mt-4">
                Launch Portal Login <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
