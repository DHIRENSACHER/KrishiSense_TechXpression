import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'max-w-xl' }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow || '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative bg-white rounded-xl p-6 shadow-lg w-full ${size} mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
