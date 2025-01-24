import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Potwierdzenie</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz anulować subskrypcję?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Anuluj
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Potwierdź
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;