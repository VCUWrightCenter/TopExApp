import React from "react";
import './Dialog.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button id="information-button" variant="contained" color="primary" onClick={handleClickOpen}><i aria-hidden="true" className="info fitted icon"></i></Button>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Application Information"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Supported Browsers: Chrome, Firefox, Edge.</p>
              
              <h4>Help Pages:</h4>
              <ul>
                  <li><a href="https://github.com/VCUWrightCenter/TopExApp#readme" target="_blank">TopEx README Documentation</a></li>
                  <li><a href="https://github.com/VCUWrightCenter/TopExApp#update-instructions" target="_blank">Application Update Instructions</a></li>
                  <li><a href="https://github.com/VCUWrightCenter/TopExApp#1-importing-document-corpus-or-previous-analysis-file-" target="_blank">Importing Documents</a></li>
                  <li><a href="https://github.com/VCUWrightCenter/TopExApp#2-setting-analysis-and-visualization-parameters-" target="_blank">Setting Parameters</a></li>
                  <li><a href="https://github.com/VCUWrightCenter/TopExApp#4-explore-and-export-results-" target="_blank">Explore and Export Results</a></li>
              </ul>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
