import React, { useEffect, useState } from 'react';
import { Image,  } from 'react-bootstrap';
import platinum from '../../../assets/images/platinum.svg'
import daimond from '../../../assets/images/daimond.svg'
import bluedaimond from '../../../assets/images/blue-daimond.svg'

const TiersData = () => {
  return (<>   
  <div>
    <div>
      <h1 className='page-title mb-5 fs-3 text-center'>13 members Are Interested In this Project.</h1>
      <div className='row gap-4 justify-content-center mb-4'>
        <div className='col-lg-3 p-md-0 col-md-5'>
          <div className='card-platinum '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={platinum} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-platinum '>Platinum</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>100</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
        <div className='col-lg-3 p-md-0 col-md-5'>
          <div className='card-daimond '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={daimond} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-diamond '>Diamond</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>100</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
        <div className='col-lg-3 p-md-0 col-md-5'>
          <div className='card-blue-daimond '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={bluedaimond} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-blue-diamond '>Blue Diamond</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>100</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
        <div className='col-lg-3 p-md-0 col-md-5'>
          <div className='card-platinum '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={platinum} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-gold '>Gold</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>100</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
        <div className='col-lg-3 p-md-0 col-md-5'>
          <div className='card-daimond '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={daimond} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-diamond '>Silver </span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>100</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
        <div className='col-lg-3 p-md-0 col-md-5'>
          <div className='card-blue-daimond '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={bluedaimond} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-bronze '>Bronze</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>100</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
  </>
  )

}

export default TiersData;
