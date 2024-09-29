import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export interface CameraActionModalProps {
  open: boolean;
  actionType: 'Edit' | 'Delete'; 
  cameraName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CameraActionModal: React.FC<CameraActionModalProps> = React.memo(({
  open,
  actionType,
  cameraName,
  onClose,
  onConfirm,
}) => {
  const getDialogContent = () => {
    if (actionType === 'Edit') {
      return `Are you sure you want to change the status of "${cameraName}"?`;
    }
    return `Are you sure you want to delete "${cameraName}"?`;
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="camera-action-modal-title">
      <DialogTitle id="camera-action-modal-title">{actionType} Camera</DialogTitle>
      <DialogContent>
        <span>{getDialogContent()}</span>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" aria-label="cancel">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary" aria-label="confirm">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default CameraActionModal;
