import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <div className="nav-brand mb-3">
            <div className="brand-icon">
              <Wrench size={20} className="text-white" />
            </div>
            <div className="brand-text">
              <span className="brand-title">APEX MOTORS</span>
              <span className="brand-sub">Service Management</span>
            </div>
          </div>
          <p className="footer-desc">
            Next-generation automotive maintenance and workshop lifecycle platform. Transparent inspections, genuine OEM parts, instant digital approvals, and reliable delivery.
          </p>
          <div className="footer-badges">
            <span className="trust-pill"><ShieldCheck size={14} /> ISO 9001 Certified Garage</span>
            <span className="trust-pill"><Clock size={14} /> 24x7 Digital Tracking</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li><Link to="/services">General Periodic Service</Link></li>
            <li><Link to="/services">Synthetic Oil & Filter Service</Link></li>
            <li><Link to="/services">Brake System Inspection & Overhaul</Link></li>
            <li><Link to="/services">HVAC / Air Conditioning Diagnostics</Link></li>
            <li><Link to="/services">OBD-II Engine Diagnostics</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Portals & Workflow</h4>
          <ul className="footer-links">
            <li><Link to="/login">Customer Booking Portal</Link></li>
            <li><Link to="/login">Staff Job Card Console</Link></li>
            <li><Link to="/login">Admin Management Suite</Link></li>
            <li><Link to="/about">Our Inspection Standards</Link></li>
            <li><Link to="/contact">Service Location & Bays</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Contact & Workshop</h4>
          <ul className="footer-contact">
            <li><MapPin size={16} /> <span>Sector 18, Industrial Automobile Hub, Pune, MH 411019</span></li>
            <li><Phone size={16} /> <span>+91 98765 43210 / (020) 2765-8900</span></li>
            <li><Mail size={16} /> <span>support@apexmotors-service.com</span></li>
            <li><Clock size={16} /> <span>Mon – Sat: 8:00 AM – 8:00 PM</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container flex-between">
          <p>© {new Date().getFullYear()} Apex Motors Management System. Developed for Campus Hiring / Assessment.</p>
          <p className="text-muted text-sm">Full-Stack MERN Architecture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
