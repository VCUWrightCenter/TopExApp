import React from "react";
import './Dialog.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import COElogo from '../../Pictures/2 Horizontal (hz)/Color (4c)/bm_CollEng_CompSci_RF_hz_4c.png'
import CSLogo from '../../Pictures/CS/CS_main.png'
import NLPLogo from '../../Pictures/dataminingfemale_final-01.png'

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
      <Button id="acknowledgements-button" variant="contained" color="primary" onClick={handleClickOpen}>Acknowledgments</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Acknowledgements"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                TopExApp (previously MedTop) was initially developed as a web app through the 2019-2020 CapStone program by Seniors in VCU's Computer Science Department under the supervision of Dr. Bridget McInnes and Amy Olex. We wish to thank Sean Kotrola, Aidan Myers, and Suzanne Prince for their excellent work in getting this application up and running! Here are links to the team's CapStone <a href="https://drive.google.com/file/d/1TGCaM7oXPxFwEJ5B5_nrGZqNnUetWPFB/view" target="_blank" rel="noopener noreferrer">Poster</a> and <a href="https://drive.google.com/file/d/1xRYlLpiYnCnI9Pdi6vbE4eTDUu0e09qB/view" target="_blank" rel="noopener noreferrer">Application Demonstration.</a>
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
                In addition, Evan French and Peter Burdette from VCU’s Wright Center for Clinical and Translational Research Informatics Core have been working tirelessly with Amy Olex to get TopEx ready for public release.  Thanks to both of you for your amazing work!
            </DialogContentText>
            <h4>References:</h4>
            <DialogContentText id="alert-dialog-description">
                Olex A, DiazGranados D, McInnes BT, and Goldberg S. Local Topic Mining for Reflective Medical Writing. Full Length Paper. AMIA Jt Summits Transl Sci Proc 2020;2020:459–68. PMCID: <a href="https://www-ncbi-nlm-nih-gov.proxy.library.vcu.edu/pmc/articles/PMC7233034/" target="_blank" rel="noopener noreferrer">PMC7233034</a>
            </DialogContentText>
            <h4>Affiliates:</h4>
            <DialogContentText>
                <img src={COElogo} className='COElogo' alt="VCU College of Engineering logo" />
                <img src={CSLogo} className='CSlogo' alt="VCU Computer Science logo" />
                <img src={NLPLogo} className='NLPlogo' alt="VCU NLP lab logo" />
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
