import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  FileCheck2,
  FileX2,
  Truck,
  XCircle,
  Check,
  ShieldAlert
} from 'lucide-react';

const statusConfig = {
  BOOKED: { label: 'Booked', color: 'badge-booked', icon: Calendar },
  CONFIRMED: { label: 'Confirmed', color: 'badge-confirmed', icon: CheckCircle2 },
  CHECKED_IN: { label: 'Checked In', color: 'badge-checkedin', icon: Clock },
  INSPECTION: { label: 'Under Inspection', color: 'badge-inspection', icon: ShieldAlert },
  ESTIMATE_PENDING: { label: 'Awaiting Approval', color: 'badge-pending', icon: Clock },
  APPROVED: { label: 'Approved', color: 'badge-approved', icon: FileCheck2 },
  REJECTED: { label: 'Estimate Rejected', color: 'badge-rejected', icon: FileX2 },
  IN_SERVICE: { label: 'In Service', color: 'badge-inservice', icon: Wrench },
  QUALITY_CHECK: { label: 'Quality Check', color: 'badge-qc', icon: CheckCircle2 },
  READY_FOR_DELIVERY: { label: 'Ready for Delivery', color: 'badge-ready', icon: Truck },
  READY: { label: 'Ready', color: 'badge-ready', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'badge-completed', icon: CheckCircle2 },
  COMPLETED: { label: 'Delivered / Completed', color: 'badge-completed', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'badge-cancelled', icon: XCircle },
  DRAFT: { label: 'Draft', color: 'badge-neutral', icon: Clock },
  PENDING_APPROVAL: { label: 'Pending Approval', color: 'badge-pending', icon: Clock },
  PAID: { label: 'Paid in Full', color: 'badge-paid', icon: Check },
  PARTIAL: { label: 'Partially Paid', color: 'badge-warning', icon: AlertCircle },
  PARTIALLY_PAID: { label: 'Partially Paid', color: 'badge-warning', icon: AlertCircle },
  UNPAID: { label: 'Payment Pending', color: 'badge-unpaid', icon: AlertCircle }
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    label: status || 'UNKNOWN',
    color: 'badge-neutral',
    icon: Clock
  };

  const Icon = config.icon;

  return (
    <span className={`badge ${config.color}`}>
      <Icon size={13} className="mr-1" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
