import React from "react";
import './Dialog.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button id="acknowledgements-button" variant="contained" color="primary" onClick={handleClickOpen}>Acknowledgments</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Getting Started"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Welcome to TopEx! Please click on the hamburger menu to start.</p>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Get Started
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
