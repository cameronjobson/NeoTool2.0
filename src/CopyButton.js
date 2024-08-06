import React from 'react';
import { FaCopy } from 'react-icons/fa';

const CopyButton = ({ getText, show }) => {
  const handleCopy = () => {
    const textToCopy = getText();
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Text copied');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (!show) {
    return null;
  }

  return (
    <button onClick={handleCopy}>
      <FaCopy /> Copy Text
    </button>
  );
};

export default CopyButton;

