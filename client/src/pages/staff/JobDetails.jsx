import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Wrench,
  Car,
  User,
  ShieldCheck,
  ClipboardList,
  FileCheck2,
  Receipt,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [history, setHistory] = useState([]);
  const [inspection, setInspection] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [delivery, setDelivery] = useState(null);

  // Inventories for estimate preparation
  const [availableParts, setAvailableParts] = useState([]);
  const [availableLabour, setAvailableLabour] = useState([]);

  // Active Sub-tab
  const [activeTab, setActiveTab] = useState('inspection');

  // Loading & Alerts
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Inspection Form State
  const defaultInspectionItems = [
    { item: 'Engine', condition: 'GOOD', notes: 'Smooth idle, no diagnostic fault codes' },
    { item: 'Brakes', condition: 'NEEDS_ATTENTION', notes: 'Brake pads worn down to 3mm; disc skimming recommended' },
    { item: 'Tyres', condition: 'GOOD', notes: 'Tread depth 5.5mm across all 4 wheels' },
    { item: 'Battery', condition: 'GOOD', notes: 'Healthy CCA output 12.6V' },
    { item: 'Engine Oil', condition: 'NEEDS_ATTENTION', notes: 'Oil viscosity dark, 10,000 km replacement due' },
    { item: 'AC', condition: 'GOOD', notes: 'Cabin vent blowing cold at 6°C' },
    { item: 'Lights', condition: 'GOOD', notes: 'Headlamps, brake lamps, indicators operational' },
    { item: 'Exterior', condition: 'GOOD', notes: 'Standard road wear' }
  ];
  const [inspectionItems, setInspectionItems] = useState(defaultInspectionItems);
  const [overallNotes, setOverallNotes] = useState('');

  // 2. Estimate Form State
  const [selectedParts, setSelectedParts] = useState([]);
  const [selectedLabour, setSelectedLabour] = useState([]);
  const [partToAdd, setPartToAdd] = useState({ partId: '', quantity: 1 });
  const [labourToAdd, setLabourToAdd] = useState({ labourId: '', quantity: 1 });

  // 3. Quality Check State
  const [qcChecks, setQcChecks] = useState({
    engine: true,
    brakes: true,
    tyres: true,
    ac: true,
    lights: true,
    testDrive: true,
    cleaning: true
  });

  // 4. Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    transactionReference: ''
  });

  // 5. Delivery Form State
  const [deliveryForm, setDeliveryForm] = useState({
    recipientName: '',
    deliveryNotes: 'Vehicle keys and original invoice handed to customer'
  });

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/service-jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.data.job);
        setHistory(res.data.data.history);

        // Populate delivery recipient default from customer name
        if (res.data.data.job.customerId?.name) {
          setDeliveryForm((prev) => ({
            ...prev,
            recipientName: res.data.data.job.customerId.name
          }));
        }

        // Fetch auxiliary records in parallel
        const [inspRes, estRes, invRes, partsRes, labourRes] = await Promise.allSettled([
          api.get(`/inspections/${id}`),
          api.get(`/estimates/job/${id}`),
          api.get(`/invoices/job/${id}`),
          api.get('/parts'),
          api.get('/labour')
        ]);

        if (inspRes.status === 'fulfilled' && inspRes.value.data.success) {
          setInspection(inspRes.value.data.data);
          setInspectionItems(inspRes.value.data.data.inspectionItems);
          setOverallNotes(inspRes.value.data.data.overallNotes || '');
        }

        if (estRes.status === 'fulfilled' && estRes.value.data.success) {
          setEstimate(estRes.value.data.data);
        }

        if (invRes.status === 'fulfilled' && invRes.value.data.success) {
          setInvoice(invRes.value.data.data);
          setPaymentForm((prev) => ({
            ...prev,
            amount: invRes.value.data.data.total - (invRes.value.data.data.amountPaid || 0)
          }));
          // Fetch payments
          const payRes = await api.get(`/payments/${invRes.value.data.data._id}`);
          if (payRes.data.success) {
            setPayments(payRes.data.data);
          }
        }

        if (partsRes.status === 'fulfilled' && partsRes.value.data.success) {
          setAvailableParts(partsRes.value.data.data);
          if (partsRes.value.data.data.length > 0) {
            setPartToAdd({ partId: partsRes.value.data.data[0]._id, quantity: 1 });
          }
        }

        if (labourRes.status === 'fulfilled' && labourRes.value.data.success) {
          setAvailableLabour(labourRes.value.data.data);
          if (labourRes.value.data.data.length > 0) {
            setLabourToAdd({ labourId: labourRes.value.data.data[0]._id, quantity: 1 });
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [id]);

  // Handle Inspection Item Change
  const handleItemConditionChange = (index, condition) => {
    const updated = [...inspectionItems];
    updated[index].condition = condition;
    setInspectionItems(updated);
  };

  const handleItemNotesChange = (index, notes) => {
    const updated = [...inspectionItems];
    updated[index].notes = notes;
    setInspectionItems(updated);
  };

  // Submit Inspection
  const handleSubmitInspection = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/inspections', {
        serviceJobId: job._id,
        inspectionItems,
        overallNotes
      });
      if (res.data.success) {
        setSuccessMsg('Inspection checklist recorded! Job moved to Estimate Pending.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
        setActiveTab('estimate');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save inspection');
    } finally {
      setSubmitting(false);
    }
  };

  // Add Part to staging list
  const handleAddPart = () => {
    const part = availableParts.find((p) => p._id === partToAdd.partId);
    if (!part) return;

    if (partToAdd.quantity > part.stockQuantity) {
      setError(`Cannot allocate ${partToAdd.quantity} units. Only ${part.stockQuantity} in stock.`);
      return;
    }

    const existingIndex = selectedParts.findIndex((p) => p.partId === part._id);
    if (existingIndex >= 0) {
      const updated = [...selectedParts];
      updated[existingIndex].quantity += Number(partToAdd.quantity);
      setSelectedParts(updated);
    } else {
      setSelectedParts([
        ...selectedParts,
        {
          partId: part._id,
          name: part.name,
          unitPrice: part.unitPrice,
          quantity: Number(partToAdd.quantity)
        }
      ]);
    }
    setError('');
  };

  const handleRemovePart = (index) => {
    setSelectedParts(selectedParts.filter((_, i) => i !== index));
  };

  // Add Labour to staging list
  const handleAddLabour = () => {
    const lab = availableLabour.find((l) => l._id === labourToAdd.labourId);
    if (!lab) return;

    const existingIndex = selectedLabour.findIndex((l) => l.labourId === lab._id);
    if (existingIndex >= 0) {
      const updated = [...selectedLabour];
      updated[existingIndex].quantity += Number(labourToAdd.quantity);
      setSelectedLabour(updated);
    } else {
      setSelectedLabour([
        ...selectedLabour,
        {
          labourId: lab._id,
          name: lab.name,
          unitCharge: lab.charge,
          quantity: Number(labourToAdd.quantity)
        }
      ]);
    }
  };

  const handleRemoveLabour = (index) => {
    setSelectedLabour(selectedLabour.filter((_, i) => i !== index));
  };

  // Generate Estimate
  const handleGenerateEstimate = async () => {
    if (selectedParts.length === 0 && selectedLabour.length === 0) {
      setError('Please allocate at least one spare part or labour operation.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/estimates', {
        serviceJobId: job._id,
        parts: selectedParts.map((p) => ({ partId: p.partId, quantity: p.quantity })),
        labour: selectedLabour.map((l) => ({ labourId: l.labourId, quantity: l.quantity })),
        notes: 'Pre-service estimate based on multi-point inspection findings'
      });

      if (res.data.success) {
        setSuccessMsg('Digital estimate generated! Notification dispatched for customer approval.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate estimate');
    } finally {
      setSubmitting(false);
    }
  };

  // Start Service
  const handleStartService = async () => {
    try {
      const res = await api.put(`/service-jobs/${job._id}/status`, {
        status: 'IN_SERVICE',
        remarks: 'Technician commenced authorized maintenance and parts replacement'
      });
      if (res.data.success) {
        setSuccessMsg('Service commenced! Status changed to IN SERVICE.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start service');
    }
  };

  // Complete Service Work
  const handleCompleteServiceWork = async () => {
    try {
      const res = await api.put(`/service-jobs/${job._id}/status`, {
        status: 'QUALITY_CHECK',
        remarks: 'Mechanical work completed. Vehicle moved to Quality Assurance bay.'
      });
      if (res.data.success) {
        setSuccessMsg('Work completed! Vehicle transferred for Quality Check.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    }
  };

  // Mark Ready For Delivery
  const handleMarkReadyForDelivery = async () => {
    // Check all QC passed
    const allPassed = Object.values(qcChecks).every((val) => val === true);
    if (!allPassed) {
      setError('All 7 quality check items must be verified and passed before delivery sign-off.');
      return;
    }

    try {
      const res = await api.put(`/delivery/ready/${job._id}`);
      if (res.data.success) {
        setSuccessMsg('Quality check passed! Vehicle is marked READY FOR DELIVERY.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
        setActiveTab('billing');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update delivery status');
    }
  };

  // Generate Final Invoice
  const handleGenerateInvoice = async () => {
    try {
      const res = await api.post('/invoices', { serviceJobId: job._id });
      if (res.data.success) {
        setSuccessMsg('Final invoice generated!');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate invoice');
    }
  };

  // Record Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!invoice) return;

    try {
      const res = await api.post('/payments', {
        invoiceId: invoice._id,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionReference: paymentForm.transactionReference
      });

      if (res.data.success) {
        setSuccessMsg('Payment recorded successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  // Complete Vehicle Delivery
  const handleCompleteDelivery = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/delivery', {
        serviceJobId: job._id,
        recipientName: deliveryForm.recipientName,
        deliveryNotes: deliveryForm.deliveryNotes
      });

      if (res.data.success) {
        setSuccessMsg('Vehicle successfully delivered! Service job is now marked COMPLETED.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchJobData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete delivery');
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-10">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8">
        <div className="alert alert-error">Job not found</div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Top Banner Header */}
      <div className="page-header flex-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-2xl font-extrabold text-primary">{job.jobNumber}</span>
            <StatusBadge status={job.status} />
          </div>
          <p className="page-subtitle">
            Booking ref: {job.bookingId?.bookingNumber} • Initiated on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/staff/jobs" className="btn btn-outline btn-sm">
            Back to Active Jobs
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Vehicle & Customer Summary Card */}
      <div className="content-card mb-6">
        <div className="card-body p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-r border-border pr-4">
            <span className="text-xs text-muted block mb-1 font-bold uppercase">Vehicle Information</span>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-dark text-base">
                {job.vehicleId?.brand} {job.vehicleId?.model}
              </strong>
              <span className="plate-badge text-xs">{job.vehicleId?.registrationNumber}</span>
            </div>
            <p className="text-xs text-muted">
              {job.vehicleId?.variant || 'Standard'} • {job.vehicleId?.fuelType} • Odometer: {job.vehicleId?.currentMileage?.toLocaleString()} km
            </p>
          </div>

          <div className="border-r border-border pr-4">
            <span className="text-xs text-muted block mb-1 font-bold uppercase">Customer</span>
            <strong className="text-dark text-base">{job.customerId?.name}</strong>
            <p className="text-xs text-muted">{job.customerId?.phone} • {job.customerId?.email}</p>
          </div>

          <div>
            <span className="text-xs text-muted block mb-1 font-bold uppercase">Reported Issue / Complaint</span>
            <p className="text-xs text-dark bg-slate-50 p-2 rounded border border-border">
              "{job.reportedProblem}"
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Navigation Tabs */}
      <div className="workflow-tabs mb-6 flex gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inspection')}
          className={`tab-btn ${activeTab === 'inspection' ? 'active' : ''}`}
        >
          <ShieldAlert size={16} /> 1. Diagnostic Inspection {inspection && '✓'}
        </button>
        <button
          onClick={() => setActiveTab('estimate')}
          className={`tab-btn ${activeTab === 'estimate' ? 'active' : ''}`}
        >
          <FileCheck2 size={16} /> 2. Parts, Labour & Estimate {estimate?.status === 'APPROVED' && '✓'}
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`tab-btn ${activeTab === 'service' ? 'active' : ''}`}
        >
          <Wrench size={16} /> 3. Service Work & Quality Check
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
        >
          <Receipt size={16} /> 4. Invoicing, Payment & Handover {invoice?.paymentStatus === 'PAID' && '✓'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
        >
          <Clock size={16} /> 5. Audit History ({history.length})
        </button>
      </div>

      {/* TAB 1: MULTI-POINT INSPECTION */}
      {activeTab === 'inspection' && (
        <div className="content-card mb-6">
          <div className="card-header flex-between">
            <h3 className="card-title">Multi-Point Diagnostic Inspection (8 Checkpoints)</h3>
            {inspection && (
              <span className="text-xs text-success font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Completed by {inspection.inspectedBy?.name}
              </span>
            )}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitInspection}>
              <div className="inspection-table-wrap mb-4">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Checkpoint</th>
                      <th style={{ width: '40%' }}>Condition Rating</th>
                      <th style={{ width: '40%' }}>Inspection Findings & Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionItems.map((item, idx) => (
                      <tr key={item.item}>
                        <td className="font-bold text-dark">{item.item}</td>
                        <td>
                          <div className="flex gap-2">
                            {['GOOD', 'NEEDS_ATTENTION', 'CRITICAL'].map((cond) => (
                              <label
                                key={cond}
                                className={`cond-pill ${item.condition === cond ? cond.toLowerCase() : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={`cond-${item.item}`}
                                  value={cond}
                                  checked={item.condition === cond}
                                  onChange={() => handleItemConditionChange(idx, cond)}
                                  className="hidden"
                                />
                                {cond.replace('_', ' ')}
                              </label>
                            ))}
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control text-xs py-1"
                            value={item.notes}
                            onChange={(e) => handleItemNotesChange(idx, e.target.value)}
                            placeholder="Observations, fluid color, wear..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Overall Inspector Recommendations</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Summary of findings for estimate preparation..."
                  value={overallNotes}
                  onChange={(e) => setOverallNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Saving Inspection...' : 'Save Inspection & Proceed to Estimate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ESTIMATE PREPARATION & CUSTOMER APPROVAL */}
      {activeTab === 'estimate' && (
        <div className="estimate-section">
          {/* Estimate Status Bar */}
          {estimate && (
            <div className={`p-4 rounded-lg mb-6 border flex-between ${
              estimate.status === 'APPROVED'
                ? 'bg-emerald-subtle border-emerald-300 text-emerald-900'
                : estimate.status === 'REJECTED'
                ? 'bg-rose-subtle border-rose-300 text-rose-900'
                : 'bg-amber-subtle border-amber-300 text-amber-900'
            }`}>
              <div>
                <strong>Estimate {estimate.estimateNumber}: </strong>
                <span className="font-semibold">{estimate.status}</span>
                {estimate.status === 'APPROVED' && (
                  <p className="text-xs mt-0.5">Approved on {new Date(estimate.approvedAt).toLocaleString()}</p>
                )}
                {estimate.status === 'REJECTED' && (
                  <p className="text-xs mt-0.5">Reason: {estimate.customerRemarks}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs block">Estimated Total</span>
                <span className="font-mono text-xl font-bold">₹{estimate.total?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Allocation Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Parts Picker */}
            <div className="content-card">
              <div className="card-header">
                <h4 className="card-title text-sm">Add Spare Parts from Inventory</h4>
              </div>
              <div className="card-body">
                <div className="flex gap-2 mb-3">
                  <select
                    className="form-control text-sm"
                    value={partToAdd.partId}
                    onChange={(e) => setPartToAdd({ ...partToAdd, partId: e.target.value })}
                  >
                    {availableParts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.stockQuantity}) - ₹{p.unitPrice}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    className="form-control text-sm w-20"
                    value={partToAdd.quantity}
                    onChange={(e) => setPartToAdd({ ...partToAdd, quantity: e.target.value })}
                  />
                  <button type="button" onClick={handleAddPart} className="btn btn-outline btn-sm">
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div className="allocated-list">
                  {selectedParts.length === 0 ? (
                    <p className="text-xs text-muted italic">No parts added yet</p>
                  ) : (
                    selectedParts.map((p, i) => (
                      <div key={i} className="flex-between py-1.5 border-b border-border text-xs">
                        <div>
                          <strong>{p.name}</strong> × {p.quantity}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">₹{(p.quantity * p.unitPrice).toLocaleString()}</span>
                          <button onClick={() => handleRemovePart(i)} className="text-danger hover:underline">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Labour Picker */}
            <div className="content-card">
              <div className="card-header">
                <h4 className="card-title text-sm">Add Labour Operations</h4>
              </div>
              <div className="card-body">
                <div className="flex gap-2 mb-3">
                  <select
                    className="form-control text-sm"
                    value={labourToAdd.labourId}
                    onChange={(e) => setLabourToAdd({ ...labourToAdd, labourId: e.target.value })}
                  >
                    {availableLabour.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name} - ₹{l.charge}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    className="form-control text-sm w-20"
                    value={labourToAdd.quantity}
                    onChange={(e) => setLabourToAdd({ ...labourToAdd, quantity: e.target.value })}
                  />
                  <button type="button" onClick={handleAddLabour} className="btn btn-outline btn-sm">
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div className="allocated-list">
                  {selectedLabour.length === 0 ? (
                    <p className="text-xs text-muted italic">No labour operations added yet</p>
                  ) : (
                    selectedLabour.map((l, i) => (
                      <div key={i} className="flex-between py-1.5 border-b border-border text-xs">
                        <div>
                          <strong>{l.name}</strong> × {l.quantity}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">₹{(l.quantity * l.unitCharge).toLocaleString()}</span>
                          <button onClick={() => handleRemoveLabour(i)} className="text-danger hover:underline">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={handleGenerateEstimate}
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Generating Estimate...' : 'Generate Estimate & Request Customer Approval'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICE EXECUTION & QUALITY CHECK */}
      {activeTab === 'service' && (
        <div className="service-tab">
          <div className="content-card mb-6">
            <div className="card-header flex-between">
              <h3 className="card-title">Workshop Service Execution</h3>
              <StatusBadge status={job.status} />
            </div>
            <div className="card-body">
              {job.status === 'APPROVED' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded mb-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 size={18} /> Customer Has Approved the Estimate
                  </div>
                  <p className="text-xs text-emerald-700 mb-3">
                    Stock parts have been allocated. Technicians are authorized to commence repair operations.
                  </p>
                  <button onClick={handleStartService} className="btn btn-primary btn-sm">
                    <Wrench size={15} /> Start Service Repairs
                  </button>
                </div>
              )}

              {job.status === 'IN_SERVICE' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
                  <div className="flex items-center gap-2 text-blue-900 font-bold mb-1">
                    <Wrench size={18} /> Service Currently in Progress
                  </div>
                  <p className="text-xs text-blue-800 mb-3">
                    Technician is carrying out repairs, part replacements, and torque checks.
                  </p>
                  <button onClick={handleCompleteServiceWork} className="btn btn-primary btn-sm">
                    <CheckCircle2 size={15} /> Mark Work Completed & Transfer to Quality Check
                  </button>
                </div>
              )}

              {['QUALITY_CHECK', 'READY_FOR_DELIVERY', 'COMPLETED'].includes(job.status) && (
                <div className="qc-checklist">
                  <h4 className="font-bold text-dark text-sm mb-3">
                    Post-Service Multi-Point Quality Assurance & Road Test
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {[
                      { key: 'engine', label: 'Engine Smoothness & RPM Calibration' },
                      { key: 'brakes', label: 'Brake Pedal Bite, Caliper Slide & ABS' },
                      { key: 'tyres', label: 'Wheel Torque (110 Nm) & Pressure (33 PSI)' },
                      { key: 'ac', label: 'AC Cooling & Vent Airflow' },
                      { key: 'lights', label: 'All Electrical Lights & Signals Verified' },
                      { key: 'testDrive', label: '3-Kilometre Garage Road Test Verified' },
                      { key: 'cleaning', label: 'Exterior Foam Wash & Interior Vacuuming Done' }
                    ].map((qc) => (
                      <label key={qc.key} className="flex items-center gap-2 p-2 bg-slate-50 border border-border rounded text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={qcChecks[qc.key]}
                          onChange={(e) => setQcChecks({ ...qcChecks, [qc.key]: e.target.checked })}
                        />
                        <span>{qc.label}</span>
                      </label>
                    ))}
                  </div>

                  {job.status === 'QUALITY_CHECK' && (
                    <button onClick={handleMarkReadyForDelivery} className="btn btn-primary btn-sm">
                      <Truck size={15} /> Sign-off QC & Mark Ready for Delivery
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVOICING & PAYMENT & DELIVERY */}
      {activeTab === 'billing' && (
        <div className="billing-tab">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Section */}
            <div className="content-card">
              <div className="card-header flex-between">
                <h4 className="card-title text-sm">Final Tax Invoice</h4>
                {invoice ? <StatusBadge status={invoice.paymentStatus} /> : null}
              </div>
              <div className="card-body">
                {!invoice ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-muted mb-3">No final invoice generated yet.</p>
                    <button onClick={handleGenerateInvoice} className="btn btn-primary btn-sm">
                      <Receipt size={15} /> Generate Final Invoice
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex-between mb-2">
                      <span className="font-mono font-bold text-primary">{invoice.invoiceNumber}</span>
                      <span className="text-xs text-muted">{new Date(invoice.issuedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="invoice-preview p-3 bg-slate-50 rounded border border-border text-xs mb-4">
                      <div className="flex-between py-1">
                        <span>Subtotal (Parts + Labour):</span>
                        <span className="font-mono">₹{invoice.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex-between py-1">
                        <span>GST / Taxes (18%):</span>
                        <span className="font-mono">₹{invoice.tax?.toLocaleString()}</span>
                      </div>
                      <div className="flex-between py-1 font-bold text-dark border-t border-border mt-1 pt-1 text-sm">
                        <span>Total Payable:</span>
                        <span className="font-mono text-primary">₹{invoice.total?.toLocaleString()}</span>
                      </div>
                      <div className="flex-between py-1 text-success font-semibold">
                        <span>Amount Received:</span>
                        <span className="font-mono">₹{(invoice.amountPaid || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Record Payment Form */}
                    {invoice.paymentStatus !== 'PAID' && (
                      <form onSubmit={handleRecordPayment} className="border-t border-border pt-3">
                        <h5 className="font-bold text-xs uppercase text-muted mb-2">Simulated Payment Recording</h5>
                        <div className="form-row mb-2">
                          <div className="form-group">
                            <label className="form-label text-xs">Amount (₹)</label>
                            <input
                              type="number"
                              required
                              className="form-control text-xs py-1"
                              value={paymentForm.amount}
                              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-xs">Payment Method</label>
                            <select
                              className="form-control text-xs py-1"
                              value={paymentForm.paymentMethod}
                              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                            >
                              <option value="UPI">UPI</option>
                              <option value="CARD">Debit / Credit Card</option>
                              <option value="CASH">Cash Settlement</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm btn-block">
                          Record Payment
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Handover & Delivery Section */}
            <div className="content-card">
              <div className="card-header">
                <h4 className="card-title text-sm">Vehicle Handover & Delivery Sign-Off</h4>
              </div>
              <div className="card-body">
                {job.status === 'COMPLETED' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center">
                    <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
                    <h4 className="font-bold text-dark">Vehicle Handed Over</h4>
                    <p className="text-xs text-muted">
                      Delivery record archived in customer vehicle service history.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCompleteDelivery}>
                    <div className="mb-3 text-xs">
                      <div className="flex items-center gap-1.5 mb-1 font-semibold">
                        <CheckCircle2 size={14} className={job.status === 'READY_FOR_DELIVERY' ? 'text-success' : 'text-muted'} />
                        <span>Ready For Delivery: {job.status === 'READY_FOR_DELIVERY' ? 'YES' : 'NO'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 size={14} className={invoice?.paymentStatus === 'PAID' ? 'text-success' : 'text-muted'} />
                        <span>Invoice Settled: {invoice?.paymentStatus === 'PAID' ? 'YES (PAID)' : 'PENDING'}</span>
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label text-xs">Recipient Customer Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control text-xs py-1"
                        value={deliveryForm.recipientName}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, recipientName: e.target.value })}
                      />
                    </div>

                    <div className="form-group mb-4">
                      <label className="form-label text-xs">Handover Remarks</label>
                      <input
                        type="text"
                        className="form-control text-xs py-1"
                        value={deliveryForm.deliveryNotes}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryNotes: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={job.status !== 'READY_FOR_DELIVERY' || invoice?.paymentStatus !== 'PAID'}
                      className="btn btn-primary btn-sm btn-block"
                    >
                      <Truck size={15} /> Complete Delivery Sign-Off
                    </button>
                    {(job.status !== 'READY_FOR_DELIVERY' || invoice?.paymentStatus !== 'PAID') && (
                      <span className="text-xs text-danger block text-center mt-1">
                        Requires READY_FOR_DELIVERY status and settled payment
                      </span>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL / STATUS HISTORY */}
      {activeTab === 'history' && (
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Chronological Lifecycle Status History</h3>
          </div>
          <div className="card-body">
            <div className="status-history-timeline">
              {history.map((h, i) => (
                <div key={h._id || i} className="history-step flex gap-4 pb-4">
                  <div className="history-dot-col flex flex-col items-center">
                    <div className="history-dot"></div>
                    {i < history.length - 1 && <div className="history-line flex-1"></div>}
                  </div>
                  <div className="history-content flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={h.newStatus} />
                      <span className="text-xs text-muted">
                        by <strong>{h.changedBy?.name}</strong> • {new Date(h.changedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-dark">{h.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
