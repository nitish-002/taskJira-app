import Modal from './Modal';
import Button from './Button';
import { ExclamationCircleIcon } from './Icons';

/**
 * A reusable confirmation dialog component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when the dialog should close
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmLabel - Label for the confirm button
 * @param {string} props.cancelLabel - Label for the cancel button
 * @param {Function} props.onConfirm - Function to call when the user confirms
 * @param {string} props.confirmStyle - Style for the confirm button (primary, danger, success)
 */
function ConfirmDialog({
  isOpen,
  onClose,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmStyle = 'danger'
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  const footer = (
    <>
      <Button 
        variant="secondary"
        onClick={onClose}
      >
        {cancelLabel}
      </Button>
      <Button 
        variant={confirmStyle} 
        onClick={handleConfirm}
      >
        {confirmLabel}
      </Button>
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={footer}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <ExclamationCircleIcon className="h-6 w-6 text-danger-500" />
        </div>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
