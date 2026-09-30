import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Sparkles,
  PenTool,
  Car,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Check
} from 'lucide-react';

const Services = () => {
  const serviceCatalog = [
    {
      name: 'General Periodic Service',
      time: '3 - 4 Hours',
      price: 'Starting from ₹2,999',
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80',
      badge: 'Popular',
      features: [
        'Comprehensive 40-point safety inspection',
        'Engine oil & oil filter replacement',
        'Air filter & cabin pollen filter cleaning/replacement',
        'Coolant & brake fluid top-up',
        'Spark plugs / fuel injector check',
        'Complete car wash & interior vacuuming'
      ]
    },
    {
      name: 'Brake System Service & Overhaul',
      time: '2 Hours',
      price: 'Starting from ₹1,499',
      image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=800&q=80',
      badge: 'Safety Critical',
      features: [
        'Front & rear brake pad thickness measurement',
        'Brake disc / rotor inspection & lathe skimming',
        'Caliper pin greasing & slider check',
        'Brake line bleeding & fresh DOT-4 hydraulic fluid',
        'Handbrake cable tension adjustment'
      ]
    },
    {
      name: 'Climate Control (AC) Servicing',
      time: '2 - 3 Hours',
      price: 'Starting from ₹1,899',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      badge: 'Climate Comfort',
      features: [
        'R134a / R1234yf refrigerant pressure test',
        'Compressor oil replenishment',
        'Condenser coil cleaning & de-clogging',
        'Cooling coil antibacterial foam sanitization',
        'Cabin blower fan speed & vent temperature measurement'
      ]
    },
    {
      name: 'Engine Diagnostics & Tuning',
      time: '2 - 4 Hours',
      price: 'Starting from ₹1,999',
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
      badge: 'OEM Diagnostic',
      features: [
        'OBD-II ECU computer scanner diagnostic report',
        'Throttle body cleaning & sensor calibration',
        'Fuel pump pressure & delivery test',
        'Ignition coil & spark resistance testing',
        'Exhaust gas & emissions health evaluation'
      ]
    },
    {
      name: 'Tyre, Wheel & Suspension',
      time: '1.5 Hours',
      price: 'Starting from ₹999',
      image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
      badge: '3D Laser Alignment',
      features: [
        '3D computer computerized wheel alignment',
        'Automated dynamic wheel balancing & weights',
        'Tyre tread depth & sidewall wear check',
        'Suspension bushing & ball joint inspection',
        'Shock absorber hydraulic leak assessment'
      ]
    },
    {
      name: 'Battery & Electrical Diagnosis',
      time: '1 Hour',
      price: 'Starting from ₹499',
      image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=800&q=80',
      badge: 'Fast Turnaround',
      features: [
        'Battery Cold Cranking Amps (CCA) load test',
        'Alternator charging voltage verification',
        'Starter motor draw test',
        'Terminal anti-corrosion lubrication',
        'Auxiliary fuse & relay check'
      ]
    }
  ];

  return (
    <div className="services-page py-12">
      <div className="container">
        <div className="section-header text-center mb-10">
          <span className="section-tag">Factory-Grade Precision</span>
          <h1 className="section-title">Automotive Service Catalog</h1>
          <p className="section-sub">
            All services include comprehensive multi-point inspection, transparent estimate generation, and digital sign-off.
          </p>
        </div>

        <div className="catalog-grid">
          {serviceCatalog.map((svc, idx) => (
            <div key={idx} className="catalog-card">
              <div className="catalog-media-header">
                <img
                  src={svc.image}
                  alt={svc.name}
                  className="catalog-img"
                  loading="lazy"
                />
                <span className="catalog-badge">{svc.badge}</span>
              </div>
              <div className="catalog-body">
                <div className="catalog-header">
                  <h3 className="catalog-title">{svc.name}</h3>
                  <div className="catalog-meta">
                    <span className="catalog-time"><Clock size={14} /> {svc.time}</span>
                    <span className="catalog-price">{svc.price}</span>
                  </div>
                </div>
                <ul className="catalog-features">
                  {svc.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <CheckCircle2 size={16} className="text-primary feature-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="catalog-footer">
                  <Link to="/register" className="btn btn-primary btn-block">
                    Book This Service <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
