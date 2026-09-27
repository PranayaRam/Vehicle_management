import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Car,
  Receipt,
  FileCheck2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  Eye,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import InvoiceModal from '../../components/common/InvoiceModal';
import InspectionReportModal from '../../components/common/InspectionReportModal';
import EmptyState from '../../components/common/EmptyState';

const ServiceHistory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals for viewing invoice or inspection
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vehicles/my');
        if (res.data.success) {
          setVehicles(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedVehicleId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedVehicleId) return;
      try {
        setHistoryLoading(true);
        const res = await api.get(`/delivery/history/${selectedVehicleId}`);
        if (res.data.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load vehicle history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [selectedVehicleId]);

  const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);

  return (
    <div className="service-history-page max-w-5xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Vehicle Maintenance History</h1>
          <p className="page-subtitle">Complete chronological record of all certified service jobs, part replacements, and handover sign-offs</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="content-card p-8 text-center">
          <Car size={36} className="text-[#ffb703] mx-auto mb-2 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-2">No Vehicles Registered</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
            Add a vehicle to your profile to build and view its permanent digital maintenance ledger.
          </p>
          <Link to="/customer/vehicles" className="btn btn-primary">
            Register Vehicle
          </Link>
        </div>
      ) : (
        <div>
          {/* Vehicle Selector */}
          <div className="content-card p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Car size={20} className="text-primary flex-shrink-0" />
              <div>
                <span className="text-xs text-muted block">Viewing Service History For:</span>
                <span className="text-sm font-bold text-white">
                  {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.registrationNumber})
                </span>
              </div>
            </div>

            <div className="w-full sm:w-72">
              <select
                className="form-input w-full text-xs font-semibold"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
              >
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.brand} {v.model} — {v.registrationNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* History Records Timeline */}
          {historyLoading ? (
            <div className="flex-center py-12">
              <div className="spinner"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="content-card p-8 text-center">
              <History size={36} className="text-muted mx-auto mb-2" />
              <h3 className="text-md font-bold text-white mb-1">No Past Services Completed Yet</h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto mb-4">
                Completed services with signed delivery handovers for this vehicle will appear here automatically.
              </p>
              <Link to="/customer/book" className="btn btn-primary btn-sm">
                Schedule Service
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record, index) => {
                const { job, invoice, delivery, inspection } = record;
                return (
                  <div key={job?._id || index} className="content-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex-between flex-wrap gap-4 border-b border-border pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-lg text-primary">{job?.jobNumber}</span>
                          <span className="badge badge-success text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            COMPLETED & DELIVERED
                          </span>
                        </div>
                        <p className="text-xs text-muted font-mono">
                          Vehicle Mileage: <strong className="text-white">{job?.vehicleId?.currentMileage?.toLocaleString()} km</strong>
                        </p>
                      </div>

                      <div className="text-right text-xs text-muted">
                        <div>Delivered to: <strong className="text-white">{delivery?.recipientName || 'Customer'}</strong></div>
                        <div>Date: <span className="font-mono text-gray-300">{new Date(delivery?.deliveryDate || job?.updatedAt).toLocaleDateString()}</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
                      <div className="bg-[#0b0e15] p-3 rounded-lg border border-border">
                        <span className="text-muted block mb-1">Customer Concern:</span>
                        <p className="text-gray-200 italic">"{job?.reportedProblem || 'Standard Periodic Service'}"</p>
                      </div>

                      <div className="bg-[#0b0e15] p-3 rounded-lg border border-border">
                        <span className="text-muted block mb-1">Service Execution:</span>
                        <p className="text-gray-200">
                          Handled by: <strong className="text-white">{job?.assignedStaffId?.name || 'Service Advisor'}</strong>
                        </p>
                        <p className="text-emerald-400 font-semibold mt-1">Road test & Quality Check passed</p>
                      </div>

                      <div className="bg-[#0b0e15] p-3 rounded-lg border border-border">
                        <span className="text-muted block mb-1">Settlement Summary:</span>
                        <div className="font-mono font-bold text-white text-sm">
                          Total: ₹{invoice?.total?.toLocaleString() || 'N/A'}
                        </div>
                        <span className="text-emerald-400 font-semibold text-[11px]">Paid in full via {invoice?.invoiceNumber}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      {inspection && (
                        <button
                          onClick={() => {
                            setSelectedInspection(inspection);
                            setInspectionModalOpen(true);
                          }}
                          className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1.5"
                        >
                          <FileCheck2 size={13} /> View Inspection Report
                        </button>
                      )}

                      {invoice && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setInvoiceModalOpen(true);
                          }}
                          className="btn btn-primary btn-sm py-1 px-3 text-xs flex items-center gap-1.5"
                        >
                          <Receipt size={13} /> View Invoice Receipt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModalOpen && selectedInvoice && (
        <InvoiceModal
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          invoice={selectedInvoice}
        />
      )}

      {/* Inspection Modal */}
      {inspectionModalOpen && selectedInspection && (
        <InspectionReportModal
          isOpen={inspectionModalOpen}
          onClose={() => setInspectionModalOpen(false)}
          inspection={selectedInspection}
        />
      )}
    </div>
  );
};

export default ServiceHistory;
