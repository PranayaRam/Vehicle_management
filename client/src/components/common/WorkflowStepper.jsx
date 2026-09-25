import React from 'react';
import {
  CalendarCheck,
  ClipboardList,
  ShieldAlert,
  FileCheck2,
  CheckCircle,
  Wrench,
  Sparkles,
  Truck,
  CheckCheck
} from 'lucide-react';

const STAGES = [
  { key: 'BOOKED', label: 'Booked', icon: CalendarCheck },
  { key: 'CHECKED_IN', label: 'Check-In', icon: ClipboardList },
  { key: 'INSPECTION', label: 'Inspection', icon: ShieldAlert },
  { key: 'ESTIMATE_PENDING', label: 'Estimate', icon: FileCheck2 },
  { key: 'APPROVED', label: 'Approved', icon: CheckCircle },
  { key: 'IN_SERVICE', label: 'In Service', icon: Wrench },
  { key: 'QUALITY_CHECK', label: 'Quality Check', icon: Sparkles },
  { key: 'READY_FOR_DELIVERY', label: 'Ready', icon: Truck },
  { key: 'COMPLETED', label: 'Delivered', icon: CheckCheck }
];

const STAGE_ORDER = {
  BOOKED: 0,
  CHECKED_IN: 1,
  INSPECTION: 2,
  ESTIMATE_PENDING: 3,
  APPROVED: 4,
  IN_SERVICE: 5,
  QUALITY_CHECK: 6,
  READY_FOR_DELIVERY: 7,
  COMPLETED: 8,
  DELIVERED: 8
};

const WorkflowStepper = ({ currentStatus, compact = false }) => {
  const currentIdx = STAGE_ORDER[currentStatus] ?? 0;

  return (
    <div className={`workflow-stepper-card ${compact ? 'compact' : ''}`}>
      <div className="stepper-track">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div
              key={stage.key}
              className={`stepper-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
            >
              <div className="node-icon-wrapper">
                <Icon size={16} />
                {isCompleted && <span className="checkmark-badge">✓</span>}
              </div>
              <span className="node-label">{stage.label}</span>
              {idx < STAGES.length - 1 && (
                <div className={`node-connector ${idx < currentIdx ? 'active' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStepper;
