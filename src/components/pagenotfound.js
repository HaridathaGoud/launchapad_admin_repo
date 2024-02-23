import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setApp } from 'src/reducers/applicationReducer';
import { Button } from 'react-bootstrap';
const Pageerror = () => {
  const router = useNavigate();
  const dispatch = useDispatch()

  const onAppSelect = (app_name) => {
    dispatch(setApp(app_name));
  }
 const goToDashBoard=()=>{
  // router('/kyc/customers');
    onAppSelect("launchpad");
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
