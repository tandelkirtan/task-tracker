import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-brand-red text-white hover:bg-brand-red/90 shadow-lg shadow-brand-red/20',
    warning: 'bg-brand-yellow text-white hover:bg-brand-yellow/90 shadow-lg shadow-brand-yellow/20',
    info: 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20'
  };

  const iconColors = {
    danger: 'text-brand-red',
    warning: 'text-brand-yellow',
    info: 'text-brand-blue'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-bg-card rounded-[32px] lg:rounded-[40px] border border-border-main shadow-2xl w-full max-w-md p-6 lg:p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            "p-3 rounded-2xl bg-bg-input",
            iconColors[variant]
          )}>
            <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg lg:text-xl font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-sm lg:text-base text-text-muted font-medium">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 lg:gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 lg:py-4 rounded-2xl font-bold text-sm lg:text-base text-text-muted bg-bg-input border-2 border-border-main hover:bg-bg-card hover:border-accent/30 transition-all active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "flex-1 px-6 py-3 lg:py-4 rounded-2xl font-bold text-sm lg:text-base transition-all active:scale-[0.98]",
              variantStyles[variant]
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
