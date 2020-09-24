//This is where the data is diplayed when you click on a data point. 

import React, { Component } from "react";
import './DetailPanel.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

class DetailPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pointData: null,
            pointDisplay: ""
        }
    }

    componentDidUpdate() {
        if (this.props.pointData) {
            let pointInfo = JSON.parse(this.props.pointData)

            if (JSON.stringify(this.state.pointData) !== JSON.stringify(pointInfo)) {
                let cluster_topic = pointInfo.cluster_topic.join(", ")
                let phrase = pointInfo.phrase.join(", ");
                
                this.setState({
                    pointData: pointInfo,
                    pointDisplay: (
                    <div className = 'card-wrapper'>
                        <div className="card">
                            <div><span>Label</span> <h3>{pointInfo.label}</h3></div>
                            <div><span>Cluster</span> <h3>{pointInfo.cluster}</h3></div>
                        </div>
                        <div className="card"><h4>Phrase</h4> {phrase}</div>
                        <div className="card"><h4>Raw Sentence</h4> {pointInfo.raw_sent}</div>
                        <div className="card"><h4>Cluster Topic</h4> {cluster_topic}</div>
                        {/* <div id='exportButtons' className='exportButtons'>
                            <Button
                                onClick={(e) => util.exportSVGAsPNG("scatterplotSVG")}
                                content="Export Scatterplot"
                                className="ui black button"
                            />

                            <Button
                                onClick={(e) => util.exportSVGAsPNG("WordCloudSVG")}
                                content="Export Word Cloud"
                                className="ui black button"
                            />
                        </div> */}
                    </div>
                    )
                })
            }
        }
    }


    render() {
        return (
            <div className='right-sidebar'>
                {this.state.pointDisplay}
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
            </div>
        );
    }
}

export default DetailPanel