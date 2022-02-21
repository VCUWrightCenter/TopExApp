import React from "react";
import './Dialog.css'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Getting Started"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Welcome to TopEx! Please click on the hamburger menu to start.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{backgroundColor: '#3f51b5', color: '#FFF'}}>
            Get Started
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
