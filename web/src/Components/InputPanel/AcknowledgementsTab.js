//This is the left sidebar component. It is EXTREMELY important to this web app.
//This is where communication with the API happens. It is the gateway for data to enter and leave the web app. 
//This is where files are uploaded to the web app, eitehr for import or processing. 
//This is where the graph data is exported. NOTE: Data cannot be exported unless the user "processes" data. That is, unless you send and receive data from the API, you will not be able to export.

import React, { Component } from "react";
import './InputPanel.css';
import COElogo from '../../Pictures/2 Horizontal (hz)/Color (4c)/bm_CollEng_CompSci_RF_hz_4c.png'
import CSLogo from '../../Pictures/CS/CS_main.png'
import NLPLogo from '../../Pictures/dataminingfemale_final-01.png'
import { Header } from 'semantic-ui-react';


class AcknowledgementsTab extends Component {
    render() {
        return (
            <div className='InputPanelContainer acknowledgements'>
                <Header as='h3'> Acknowledgements </Header>
                <p>TopExApp (previously MedTop) was initially developed as a web app through the 2019-2020 CapStone program by Seniors in VCU's Computer Science Department under the supervision of Dr. Bridget McInnes and Amy Olex. We wish to thank Sean Kotrola, Aidan Myers, and Suzanne Prince for their excellent work in getting this application up and running! Here are links to the team's CapStone <a href="https://drive.google.com/file/d/1TGCaM7oXPxFwEJ5B5_nrGZqNnUetWPFB/view" target="_blank" rel="noopener noreferrer">Poster</a> and <a href="https://drive.google.com/file/d/1xRYlLpiYnCnI9Pdi6vbE4eTDUu0e09qB/view" target="_blank" rel="noopener noreferrer">Application Demonstration.</a></p>

                <Header as='h3'> References </Header>
                <p>Olex A, DiazGranados D, McInnes BT, and Goldberg S. Local Topic Mining for Reflective Medical Writing. Full Length Paper. AMIA Jt Summits Transl Sci Proc 2020;2020:459–68. PMCID: <a href="https://www-ncbi-nlm-nih-gov.proxy.library.vcu.edu/pmc/articles/PMC7233034/" target="_blank" rel="noopener noreferrer">PMC7233034</a></p>

                <Header as='h3'> Affiliates </Header>
                <img src={COElogo} className='COElogo' alt="VCU College of Engineering logo" />
                <img src={CSLogo} className='CSlogo' alt="VCU Computer Science logo" />
                <img src={NLPLogo} className='NLPlogo' alt="VCU NLP lab logo" />
            </div>
        )
    }
}

export default AcknowledgementsTab