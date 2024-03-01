import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Placeholder from 'react-bootstrap/Placeholder';
import PropTypes from 'prop-types';

function StartedSteps(props) {
    const[loader,setLoader]=useState()
    setTimeout(() => {
        setLoader(props?.formSteps)
      }, 100);

      const stepsOneListClassName =
  props?.stepsOne === "1" ? "step-list success" : "step-list active";

  const stepsOneiconClassName =
  props?.stepsOne === "1" ? "icon-dao success-icon" : "icon-dao active-check";

  const stepsTwoListClassName =
  props?.stepsTwo == "2" ? 'step-list success' : 'step-list active';

  const stepsTwoiconClassName =
  props?.stepsTwo == "2" ? 'icon-dao success-icon' : 'icon-dao active-check'


  const stepsThreeListClassName =
  props?.stepsThree == "3" ? 'step-list success' : 'step-list active'

  const stepsThreeiconClassName =
  props?.stepsThree == "3" ? 'icon-dao success-icon' : 'icon-dao active-check'


    return (
        <>
            <div className='d-flex justify-content-between align-items-center'><p className='steps-text '>Get Started With These Steps</p> <span className='disable-text disable-text-color'>{props.number}/3</span></div>
            <ProgressBar now={props?.formSteps} />
            <div className='m-auto list-items mt-5'>
               {loader? <div 
               className={stepsOneListClassName}>
                <span className={stepsOneiconClassName}></span>
                 <span className='me-3 shimmer-icon' >Create Proposal</span>

                 </div>:

               <div className='step-list active '> <Placeholder xs={12} animation="glow"> <Placeholder xs={1} className='me-3 shimmer-icon' /><Placeholder xs={8} /></Placeholder>
               </div>}
               {loader?<div className={stepsTwoListClassName}><span className={stepsTwoiconClassName}></span>Proposal Summary</div>:
                <div className='step-list active '> <Placeholder xs={12} animation="glow"> <Placeholder xs={1} className='me-3 shimmer-icon' /><Placeholder xs={8} /></Placeholder>
                </div>}
               {loader?<div className={stepsThreeListClassName}><span className={stepsThreeiconClassName}></span>Publish Proposal</div>:
               <div className='step-list active '> <Placeholder xs={12} animation="glow"> <Placeholder xs={1} className='me-3 shimmer-icon' /><Placeholder xs={8} /></Placeholder>
                </div>}
            </div>

        </>
    );
}
StartedSteps.PropTypes = {
    formSteps: PropTypes.number.isRequired,
    stepsOne: PropTypes.string.isRequired,
    stepsTwo: PropTypes.string.isRequired,
    stepsThree: PropTypes.string.isRequired,
  };
export default StartedSteps;