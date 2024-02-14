import React from 'react';
import {useNavigate} from 'react-router-dom';
const UnauthorizedError = () => {
  const router = useNavigate();

  return (
    <>  
    <div className='unauthorized-Error page-notfound d-flex align-items-center justify-content-center'>
    <div>
    <div className='text-center text-dark'>
     <h1 className='unauthorized-title'>Oops!</h1>
     <p className='mt-5 '>You don't have DAO permissions.</p>
     </div>
     <div className='text-center'>
     </div>
    </div>
    </div>
    </>
  );
};

export default UnauthorizedError;