import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page py-10">
      <div className="container">
        <div className="section-header text-center mb-8">
          <span className="section-tag">Direct Workshop Connect</span>
          <h1 className="section-title">Get In Touch With Apex Motors</h1>
          <p className="section-sub">
            Have questions regarding a service, fleet inquiry, or workshop visit? Contact our team.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-card">
            <h3>Workshop Information</h3>
            <p className="text-muted text-sm mb-4">
              Feel free to visit our service center directly or book an appointment online for expedited intake.
            </p>

            <ul className="contact-details-list">
              <li>
                <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Address</strong>
                  <p className="text-muted text-sm">Sector 18, Industrial Automobile Hub, Chinchwad, Pune, Maharashtra 411019</p>
                </div>
              </li>
              <li>
                <Phone size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <p className="text-muted text-sm">+91 98765 43210 | Landline: (020) 2765-8900</p>
                </div>
              </li>
              <li>
                <Mail size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Email Desk</strong>
                  <p className="text-muted text-sm">service@apexmotors-hub.com</p>
                </div>
              </li>
              <li>
                <Clock size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Working Hours</strong>
                  <p className="text-muted text-sm">Monday to Saturday: 8:00 AM – 8:00 PM<br/>Sunday: Emergency breakdown support only</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-form-card">
            {submitted ? (
              <div className="success-banner">
                <CheckCircle2 size={36} className="text-success mb-2" />
                <h3>Inquiry Received</h3>
                <p className="text-muted text-sm">
                  Thank you for reaching out. Our service advisor will connect with you shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm mt-3">
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-2">General Inquiry Form</h3>
                <p className="text-muted text-sm mb-4">Send a quick message to our service team.</p>

                <div className="form-group mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Message / Vehicle Model</label>
                  <textarea
                    rows={4}
                    required
                    className="form-control"
                    placeholder="Describe your question or vehicle requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  <Send size={16} /> Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
