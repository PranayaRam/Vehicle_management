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
  ArrowRight
} from 'lucide-react';

const Services = () => {
  const serviceCatalog = [
    {
      name: 'General Periodic Service',
      time: '3 - 4 Hours',
      price: 'Starting from ₹2,999',
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
    <div className="services-page py-10">
      <div className="container">
        <div className="section-header text-center mb-8">
          <span className="section-tag">Factory-Grade Precision</span>
          <h1 className="section-title">Our Service Catalog</h1>
          <p className="section-sub">
            All services include comprehensive multi-point inspection, transparent estimate generation, and digital sign-off.
          </p>
        </div>

        <div className="catalog-grid">
          {serviceCatalog.map((svc, idx) => (
            <div key={idx} className="catalog-card">
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
                <Link to="/register" className="btn btn-outline btn-block">
                  Book This Service <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
