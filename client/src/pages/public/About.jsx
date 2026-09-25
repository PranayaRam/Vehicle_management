import React from 'react';
import { ShieldCheck, Award, Users, Wrench, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="about-page py-10">
      <div className="container">
        <div className="section-header text-center mb-8">
          <span className="section-tag">About Apex Motors</span>
          <h1 className="section-title">Setting The Benchmark In Vehicle Servicing</h1>
          <p className="section-sub">
            Bridging technical garage craftsmanship with complete digital transparency.
          </p>
        </div>

        <div className="about-story-grid mb-10">
          <div className="about-text">
            <h2>Modern Workshop Infrastructure</h2>
            <p className="text-muted mb-3">
              Apex Motors was designed from the ground up to solve the universal pain point of automotive maintenance: opaque pricing, unauthorized repairs, and lack of real-time communication.
            </p>
            <p className="text-muted mb-4">
              With our unified digital management platform, every vehicle that enters our facility goes through an automated multi-stage pipeline: strict check-in logging, standardized multi-point diagnostic inspections, computerized parts inventory dispatch, and a customer estimate approval gate.
            </p>
            <div className="about-values">
              <div className="value-item">
                <ShieldCheck size={20} className="text-primary" />
                <div>
                  <strong>No Hidden Surprises</strong>
                  <p className="text-muted text-sm">Customers have unilateral control to approve or reject itemized estimates.</p>
                </div>
              </div>
              <div className="value-item">
                <Wrench size={20} className="text-primary" />
                <div>
                  <strong>OEM Specified Spares</strong>
                  <p className="text-muted text-sm">Every filter, fluid, and mechanical part is tracked with part numbers and supplier traceability.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-stats-card">
            <h3>Facility & Capability Highlights</h3>
            <ul className="facility-list">
              <li><CheckCircle2 size={16} className="text-success" /> 8 Modern Hydraulic 2-Post & Scissor Lifts</li>
              <li><CheckCircle2 size={16} className="text-success" /> Bosch OBD-II Multi-Brand Computer Diagnostic Scanners</li>
              <li><CheckCircle2 size={16} className="text-success" /> Dedicated Air-Conditioned Customer Lounge with Live Tracking</li>
              <li><CheckCircle2 size={16} className="text-success" /> Centralized Parts Warehouse with Live Stock Control</li>
              <li><CheckCircle2 size={16} className="text-success" /> Sealed Dust-Free Paint & Detailing Bay</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
