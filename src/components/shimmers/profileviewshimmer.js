import React from 'react';
import { Placeholder, Alert, Spinner, Button, Modal, Tab, Tabs, CLink, CBreadcrumb, CBreadcrumbItem } from 'react-bootstrap';

const ProfileViewShimmer = () => {
  return (
    <div className=''>
      <div className='profile-container'>      
       
       <div>
       <Placeholder as="p" animation="glow" className='mt-3 custom-flex align-items-start mb-4 tab-block'>
          <Placeholder xs={12} className='customer-pfview' />
          <div className='custom-flex align-items-center flex-wrap row gap-4 flex-1 ms-lg-4'>         
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          <Placeholder className='value-card col-md-3' />
          </div>
        </Placeholder>
       </div>
        <Placeholder as="div" animation="glow" className="text-center mt-3">
          <Placeholder xs={24} />
        </Placeholder>       
        <Placeholder as="div" animation="glow" className='profile-section mt-3'>
          <Placeholder xs={12} />
          <Placeholder xs={12} />
          <Placeholder xs={12} />
          <Placeholder xs={12} />
          <Placeholder xs={12} />
          <Placeholder xs={12} />
        </Placeholder>
        
      </div>
    </div>
  );
};

export default ProfileViewShimmer;
