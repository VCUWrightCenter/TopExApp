//This is the header at the top of the web app. It does not do much

import React, { Component } from "react";
import './Header.css'
import COElogo from '../../Pictures/2 Horizontal (hz)/Color (4c)/bm_CollEng_CompSci_RF_hz_4c.png'
import CSLogo from '../../Pictures/CS/CS_main.png'
import NLPLogo from '../../Pictures/dataminingfemale_final-01.png'
import wrightCtrLogo from '../../Pictures/bm_WrightCtr_st_4c.png'

class Header extends Component {
    render() {
        return (
            <div className='Header'>
                <img src={CSLogo} className='CSlogo' alt="VCU Computer Science logo"/>
                <img src={COElogo} className='COElogo' alt="VCU College of Engineering logo"/>
                <img src={wrightCtrLogo} className='Wrightlogo' alt="VCU Wright Center logo"/>
                <img src={NLPLogo} className='NLPlogo' alt="VCU NLP lab logo"/>
            </div>
        );
    }
}

export default Header