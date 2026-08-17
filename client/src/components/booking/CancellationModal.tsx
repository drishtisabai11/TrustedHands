import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';

export interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => Promise<void>;
  bookingNumber: string;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  bookingNumber,
}) => {
  const [reason, setReason] = useState('Changed my mind');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const finalReason = reason === 'Other' ? customReason || 'Other reason' : reason;
      await onConfirmCancel(finalReason);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Booking Cancellation"
      subtitle={`Cancel booking #${bookingNumber}`}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="p-3 bg-clay/10 rounded border border-clay/30 text-charcoal flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-clay shrink-0 mt-0.5" />
          <span>
            Are you sure you want to cancel this booking? If payment was completed, a full refund will be processed to your original payment method.
          </span>
        </div>

        <Select
          label="Reason for Cancellation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={[
            { value: 'Changed my mind', label: 'Changed my mind' },
            { value: 'Found another professional', label: 'Found another professional' },
            { value: 'Wrong service selected', label: 'Wrong service selected' },
            { value: 'Schedule changed', label: 'Schedule changed' },
            { value: 'Other', label: 'Other reason' },
          ]}
        />

        {reason === 'Other' && (
          <div className="flex flex-col gap-1.5 font-sans">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Please specify reason
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Tell us why you are cancelling..."
              className="w-full p-2.5 bg-bone border border-mist rounded text-xs focus:outline-none focus:border-mineral"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="text" onClick={onClose} disabled={isLoading}>
            Keep Booking
          </Button>
          <Button type="submit" variant="danger" isLoading={isLoading}>
            Confirm Cancellation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
