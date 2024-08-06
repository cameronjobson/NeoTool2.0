import React, { useState, useEffect } from 'react';
import './ExpandablePanel.css';

function ExpandablePanel({ title, children, defaultOpen = false, isSubPanel = false, show }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Optional: Effect to handle prop changes, if you need to allow external control to reset the open state
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  if (!show) {
    return null;
  }

  return (
    <div className="expandable-panel">
      <button className={`${isSubPanel ? 'expandable-subpanel-button' : 'expandable-panel-button'}`} onClick={togglePanel}>
        <span className={`expandable-panel-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? '▼' : '►'}
        </span>
        {title}
      </button>
      <div className={`expandable-panel-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default ExpandablePanel;