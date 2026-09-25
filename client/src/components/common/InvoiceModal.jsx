import React from 'react';
import { Printer, X, CheckCircle2, AlertTriangle, ShieldCheck, Car } from 'lucide-react';
import StatusBadge from './StatusBadge';

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const partsSubtotal = invoice.parts?.reduce((acc, p) => acc + (p.total || 0), 0) || 0;
  const labourSubtotal = invoice.labour?.reduce((acc, l) => acc + (l.total || 0), 0) || 0;
  const cgst = Math.round((invoice.tax || 0) / 2);
  const sgst = (invoice.tax || 0) - cgst;
  const balanceDue = Math.max(0, (invoice.total || 0) - (invoice.amountPaid || 0));

  return (
    <div className="modal-backdrop invoice-modal-backdrop">
      <div className="modal-content invoice-modal-container max-w-3xl">
        {/* Screen Header / Actions (Hidden during print) */}
        <div className="flex-between p-4 border-b border-border no-print bg-slate-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="font-bold text-dark text-base">Tax Invoice Preview</span>
            <span className="text-xs text-muted font-mono">({invoice.invoiceNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline btn-sm p-1.5 text-muted hover:text-dark"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="invoice-printable-sheet p-8 bg-white text-dark">
          {/* Header & Logo */}
          <div className="flex-between border-b-2 border-slate-900 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded bg-slate-900 text-white flex-center font-black text-lg">
                  A
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">APEX MOTORS</h1>
              </div>
              <p className="text-xs text-muted font-medium">Authorized Automotive Care & Diagnostic Center</p>
              <p className="text-xs text-muted">Plot 42, Sector 18, Automotive Hub, Baner, Pune - 411045</p>
              <p className="text-xs text-muted">GSTIN: 27AABCA1234F1Z5 • Phone: +91 98765 00000 • contact@apexmotors.com</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-900 uppercase tracking-wide block">TAX INVOICE</span>
              <span className="font-mono text-base font-bold text-primary block mt-1">{invoice.invoiceNumber}</span>
              <span className="text-xs text-muted block mt-1">
                Date: {new Date(invoice.issuedAt || invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div className="mt-2 inline-block">
                <StatusBadge status={invoice.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-slate-50 border border-border mb-6 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-muted text-[10px] block mb-1">Billed To (Customer)</span>
              <strong className="text-sm text-slate-900 block font-bold">{invoice.customerId?.name || 'Valued Customer'}</strong>
              <p className="text-muted mt-0.5">Phone: {invoice.customerId?.phone || 'N/A'}</p>
              <p className="text-muted">Email: {invoice.customerId?.email || 'N/A'}</p>
              {invoice.customerId?.address && (
                <p className="text-muted">Address: {invoice.customerId?.address}</p>
              )}
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-muted text-[10px] block mb-1">Vehicle & Job Details</span>
              <strong className="text-sm text-slate-900 block font-bold">
                {invoice.vehicleId?.brand} {invoice.vehicleId?.model} {invoice.vehicleId?.year ? `(${invoice.vehicleId.year})` : ''}
              </strong>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="plate-badge text-[11px] font-bold px-1.5 py-0.5">
                  {invoice.vehicleId?.registrationNumber}
                </span>
                <span className="text-muted">
                  Fuel: {invoice.vehicleId?.fuelType || 'Petrol'}
                </span>
              </div>
              <p className="text-muted mt-1">
                Job Card: <span className="font-mono font-semibold">{invoice.serviceJobId?.jobNumber || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Itemized Parts Table */}
          {invoice.parts && invoice.parts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-border pb-1">
                1. Spare Parts & Consumables
              </h3>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 text-muted font-bold">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Item Description</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-2 text-right">Unit Price</th>
                    <th className="py-2 px-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.parts.map((p, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-2 px-2 text-muted">{idx + 1}</td>
                      <td className="py-2 px-2 font-medium">{p.name}</td>
                      <td className="py-2 px-2 text-center font-mono">{p.quantity}</td>
                      <td className="py-2 px-2 text-right font-mono">₹{p.unitPrice?.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono font-semibold">₹{p.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan="4" className="py-2 px-2 text-right text-muted">Parts Subtotal:</td>
                    <td className="py-2 px-2 text-right font-mono">₹{partsSubtotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Itemized Labour Table */}
          {invoice.labour && invoice.labour.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-border pb-1">
                2. Certified Workshop Labour & Operations
              </h3>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 text-muted font-bold">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Service Operation</th>
                    <th className="py-2 px-2 text-center">Qty / Hours</th>
                    <th className="py-2 px-2 text-right">Rate</th>
                    <th className="py-2 px-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.labour.map((l, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-2 px-2 text-muted">{idx + 1}</td>
                      <td className="py-2 px-2 font-medium">{l.name}</td>
                      <td className="py-2 px-2 text-center font-mono">{l.quantity || 1}</td>
                      <td className="py-2 px-2 text-right font-mono">₹{l.unitCharge?.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono font-semibold">₹{l.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan="4" className="py-2 px-2 text-right text-muted">Labour Subtotal:</td>
                    <td className="py-2 px-2 text-right font-mono">₹{labourSubtotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Financial Calculation Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-72 bg-slate-50 p-4 rounded-lg border border-border text-xs">
              <div className="flex-between py-1 border-b border-border">
                <span className="text-muted">Taxable Subtotal:</span>
                <span className="font-mono font-medium">₹{invoice.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex-between py-1 border-b border-border text-muted">
                <span>CGST (9.0%):</span>
                <span className="font-mono">₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex-between py-1 border-b border-border text-muted">
                <span>SGST (9.0%):</span>
                <span className="font-mono">₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex-between py-1.5 font-bold text-dark text-sm border-b-2 border-slate-900 mt-1">
                <span>Grand Total:</span>
                <span className="font-mono text-primary font-black">₹{invoice.total?.toLocaleString()}</span>
              </div>
              <div className="flex-between py-1 text-success font-semibold">
                <span>Total Paid:</span>
                <span className="font-mono">₹{(invoice.amountPaid || 0).toLocaleString()}</span>
              </div>
              <div className={`flex-between py-1 font-bold ${balanceDue > 0 ? 'text-danger' : 'text-slate-700'}`}>
                <span>Balance Due:</span>
                <span className="font-mono">₹{balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dashed border-slate-300 text-xs text-muted">
            <div>
              <p className="font-bold text-dark mb-1">Terms & Conditions:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Parts replaced carry manufacturer warranty as applicable.</li>
                <li>Workmanship guaranteed for 30 days or 1,000 km.</li>
                <li>Vehicles stored at owner's risk beyond 3 days of completion notice.</li>
              </ul>
            </div>
            <div className="flex flex-col justify-end text-right">
              <div className="h-10"></div>
              <p className="font-bold text-dark border-t border-slate-400 pt-1 inline-block ml-auto">
                Authorized Signatory / Service Manager
              </p>
              <p className="text-[10px]">Apex Motors Authorized Dealership</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
