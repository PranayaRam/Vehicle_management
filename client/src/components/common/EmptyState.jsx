import React from 'react';

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={38} className="text-muted" />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm mt-3">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
