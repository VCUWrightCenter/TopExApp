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
      <Button id="information-button" variant="contained" style={{backgroundColor: '#3f51b5', color: '#FFF'}} onClick={handleClickOpen}><i aria-hidden="true" className="info fitted icon"></i></Button>
      
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
              
              <h4>Documentation:</h4>
              <ul>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual" rel="noopener noreferrer" target="_blank">TopEx User's Manual</a></li>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/installation" rel="noopener noreferrer" target="_blank">Local installation</a></li>
              </ul>

              <h4>Help Pages:</h4>
              <ul>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual#overview" rel="noopener noreferrer" target="_blank">Introduction to TopEx</a></li>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual#usage0" rel="noopener noreferrer" target="_blank">Formatting Input</a></li>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual#usage1" rel="noopener noreferrer" target="_blank">Importing Documents</a></li>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual#usage2" rel="noopener noreferrer" target="_blank">Setting Parameters</a></li>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual#usage4" rel="noopener noreferrer" target="_blank">Explore and Export Results</a></li>
              </ul>

              <h4>Tutorials:</h4>
              <ul>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/tutorial_covidTweets" rel="noopener noreferrer" target="_blank">Exploring COVID-19 Tweets</a></li>
              </ul>

              <h4>Citing TopEx:</h4>
                <ul>
                  <li><a href="https://vcuwrightcenter.github.io/TopExApp/manual#cite" rel="noopener noreferrer" target="_blank">Citation Information</a></li>
                </ul>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{backgroundColor: '#3f51b5', color: '#FFF'}} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
