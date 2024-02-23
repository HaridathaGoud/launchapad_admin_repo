import React from 'react';
import {useNavigate} from 'react-router-dom';
import { Button } from 'react-bootstrap';
const Pageerror = () => {
  const router = useNavigate();
 const goToDashBoard=()=>{
  // router('/kyc/customers');
    router('/launchpad/dashboard');
  }
  return (
    <>
    <div className='page-notfound d-flex align-items-center justify-content-center'>
    <div>
    <div className='text-center text-dark'>
     <h1 className='section-title text-white'>oops!</h1>
     <p className='mt-5 text-white'>We can't find the page that you're  <br/>looking for</p>
     </div>
     <div className='text-center'>
     <Button className='custom-btn' onClick={()=>goToDashBoard()}>Back</Button>
     </div>
    </div>
    </div>
    </>
  );
};

export default Pageerror;
