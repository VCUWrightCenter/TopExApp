//This is the header at the top of the web app. It does not do much

import React, { Component } from "react";
import './Header.css'

import topExLogo from '../../Pictures/TopEx_logo.png'
import wrightCtrLogo from '../../Pictures/bm_WrightCtr_st_4c.png'

class Header extends Component {
    render() {
        return (
            <div className='Header'>
                <img src={topExLogo} className='headerlogo' alt="TopEx Logo"/>
                <img src={wrightCtrLogo} className='headerlogo' alt="VCU Wright Center logo"/>
            </div>
        );
    }
}

export default Header