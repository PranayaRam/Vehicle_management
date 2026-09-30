import React from 'react';
import { ShieldCheck, Award, Users, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page py-12">
      <div className="container">
        <div className="section-header text-center mb-10">
          <span className="section-tag">About Apex Motors</span>
          <h1 className="section-title">Setting The Benchmark In Vehicle Servicing</h1>
          <p className="section-sub">
            Bridging master garage craftsmanship with computerized transparency and customer-approved workflows.
          </p>
        </div>

        {/* Story & Facility Section */}
        <div className="about-story-grid mb-12">
          <div className="about-text">
            <h2>Modern Workshop Infrastructure</h2>
            <p className="text-secondary mb-3">
              Apex Motors was designed from the ground up to solve the universal pain point of automotive maintenance: opaque pricing, unauthorized repairs, and lack of real-time communication.
            </p>
            <p className="text-secondary mb-4">
              With our unified digital management platform, every vehicle that enters our facility goes through an automated multi-stage pipeline: strict check-in logging, standardized multi-point diagnostic inspections, computerized parts inventory dispatch, and a customer estimate approval gate.
            </p>
            <div className="about-values">
              <div className="value-item">
                <div className="value-icon-box">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                <div>
                  <strong>No Hidden Surprises</strong>
                  <p className="text-muted text-sm">Customers have unilateral control to approve or reject itemized estimates before work starts.</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon-box">
                  <Wrench size={20} className="text-primary" />
                </div>
                <div>
                  <strong>OEM Specified Spares</strong>
                  <p className="text-muted text-sm">Every filter, fluid, and mechanical part is tracked with OEM part numbers and supplier traceability.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual-card">
            <img
              src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80"
              alt="High-tech hydraulic service bays"
              className="about-img"
            />
            <div className="about-stats-card">
              <h3>Facility & Diagnostic Capabilities</h3>
              <ul className="facility-list">
                <li><CheckCircle2 size={16} className="text-success" /> 8 Modern Hydraulic 2-Post & Scissor Lifts</li>
                <li><CheckCircle2 size={16} className="text-success" /> Bosch OBD-II Multi-Brand Computer Diagnostic Scanners</li>
                <li><CheckCircle2 size={16} className="text-success" /> Climate-Controlled Customer Lounge with Live Tracking Screen</li>
                <li><CheckCircle2 size={16} className="text-success" /> Centralized Parts Warehouse with Real-Time Stock Control</li>
                <li><CheckCircle2 size={16} className="text-success" /> Sealed Dust-Free Paint & Ceramic Detailing Bay</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Master Technician Showcase */}
        <div className="team-highlight-banner">
          <div className="team-highlight-grid">
            <div className="team-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80"
                alt="Certified Master Technician inspecting vehicle"
                className="team-img"
              />
            </div>
            <div className="team-content">
              <span className="section-tag">Human Expertise</span>
              <h2>ASE & Brand-Certified Technicians</h2>
              <p className="text-secondary mb-4">
                Our technicians hold advanced automotive engineering and mechanical credentials. Each mechanic undergoes rigorous periodic recertification on modern electronic fuel injection, hybrid powertrains, electronic braking, and computerized CAN-bus diagnostics.
              </p>
              <div className="team-stats-row">
                <div className="team-stat-item">
                  <strong>100%</strong>
                  <span>Certified Staff</span>
                </div>
                <div className="team-stat-item">
                  <strong>15+ Yrs</strong>
                  <span>Average Lead Experience</span>
                </div>
                <div className="team-stat-item">
                  <strong>40-Point</strong>
                  <span>Multi-Point Checklist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
