import React from 'react';
import user from '../../assets/images/praposal-user.png';


export default function Actions() {

    return (
        <div className='mt-3'>
        <div className='voting-card'>
        <div className='p-voting'>
        <h1 className='voting-title'>Actions </h1>
        <p className='sub-para'>These actions can be executed if the parameters you set for them are met.</p>
        <div className='bluedark-bg'>
        <div className='p-3'>
        <div className='md-d-flex align-items-center justify-content-between mb-4'>
        <h3 className='vote-subtitle'>Mint tokens</h3>
        <div>
        <span className='yellow-text vertical-align-middle'>Aragon OSx</span>
        <span className='icon-dao success-icon mx-2'></span>
        <span className='icon-dao up-arrow'></span>
        </div>
        
        </div>
        <p className='kp-lbl'>Create a proposal to mint more governance tokens. Select the wallets that should receive tokens and determine how many.</p>
        <div>
            <span className='icon-dao info-yellow'></span>
            <span className='yellow-text'>The total token supply includes all tokens you’ve already minted.</span>
        </div>
        </div><hr/>
        <div className='dao-bg-card mt-4'>
            <div>
                <img src={user} className='me-3'alt=''></img>
                <span className='vertical-align-middle'>0x4a9...929A</span>
            </div>
            <div>
                <span className='me-4 vertical-align-middle'>5 TG (100%)</span>
                <span className='icon-dao square-uparrow'></span>
            </div>
        </div>
        <div className='p-3'>
        <h3 className='vote-subtitle mt-4'>Summary</h3>
        <div className='md-d-flex align-items-center justify-content-between'>
        <p className='kp-lbl'>New tokens</p>
        <p className='kp-value'>+1 TG</p>
        </div>
        <div className='md-d-flex align-items-center justify-content-between'>
        <p className='kp-lbl'>New holders</p>
        <p className='kp-value'>+1</p>
        </div>
        <div className='md-d-flex align-items-center justify-content-between'>
        <p className='kp-lbl'>Total tokens</p>
        <p className='kp-value'>6 TG</p>
        </div>
        <div className='md-d-flex align-items-center justify-content-between'>
        <p className='kp-lbl'>Total holders</p>
        <p className='kp-value'>2</p>
        </div>
        <div className='md-d-flex align-items-center justify-content-between'>
        <p className='kp-lbl'><span className='blue-link'>See Community</span><span className='icon-dao white-uparrow'></span></p>
        
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        );
    }