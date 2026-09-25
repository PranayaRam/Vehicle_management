import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, X, Printer } from 'lucide-react';

const InspectionReportModal = ({ isOpen, onClose, inspection, vehicle }) => {
  if (!isOpen || !inspection) return null;

  const handlePrint = () => {
    window.print();
  };

  const getConditionBadge = (cond) => {
    switch (cond) {
      case 'GOOD':
        return (
          <span className="badge badge-success flex items-center gap-1">
            <CheckCircle2 size={13} /> Pass / Good
          </span>
        );
      case 'NEEDS_ATTENTION':
        return (
          <span className="badge badge-warning flex items-center gap-1">
            <AlertTriangle size={13} /> Attention Required
          </span>
        );
      case 'POOR':
      case 'CRITICAL':
        return (
          <span className="badge badge-danger flex items-center gap-1">
            <XCircle size={13} /> Immediate Failure
          </span>
        );
      default:
        return <span className="badge badge-neutral">{cond}</span>;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        {/* Actions Bar */}
        <div className="flex-between p-4 border-b border-border bg-slate-50 rounded-t-lg no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <h3 className="font-bold text-dark text-base">Multi-Point Diagnostic Inspection Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn btn-primary btn-sm flex items-center gap-1">
              <Printer size={14} /> Print Report
            </button>
            <button onClick={onClose} className="btn btn-outline btn-sm p-1.5 text-muted hover:text-dark">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 bg-white">
          {/* Header */}
          <div className="flex-between border-b border-border pb-4 mb-4">
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-wider">APEX MOTORS WORKSHOP</span>
              <h2 className="text-xl font-black text-slate-900">Diagnostic Inspection Summary</h2>
              <p className="text-xs text-muted">
                Conducted by: {inspection.inspectedBy?.name || 'Certified Inspection Specialist'} • Date: {new Date(inspection.createdAt).toLocaleDateString()}
              </p>
            </div>
            {vehicle && (
              <div className="text-right">
                <span className="font-bold text-dark block text-sm">{vehicle.brand} {vehicle.model}</span>
                <span className="plate-badge text-xs font-mono">{vehicle.registrationNumber}</span>
              </div>
            )}
          </div>

          {/* Checklist Table */}
          <div className="table-responsive mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-muted font-bold text-left border-b border-border">
                  <th className="py-2.5 px-3">System / Component</th>
                  <th className="py-2.5 px-3">Condition Status</th>
                  <th className="py-2.5 px-3">Diagnostic Findings & Notes</th>
                </tr>
              </thead>
              <tbody>
                {inspection.checklist?.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-dark">{item.item}</td>
                    <td className="py-2.5 px-3">{getConditionBadge(item.condition)}</td>
                    <td className="py-2.5 px-3 text-muted">{item.notes || 'No issues detected'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall Inspector Remarks */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Lead Inspector Observations:
            </span>
            <p className="text-xs text-dark italic">
              "{inspection.overallNotes || 'Vehicle passed primary safety inspection with noted preventive maintenance items.'}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReportModal;
