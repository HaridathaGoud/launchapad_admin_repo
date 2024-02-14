import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import user from '../../assets/images/praposal-user.png';
import ProgressBar from 'react-bootstrap/ProgressBar';
import voteimg from '../../assets/images/vote-img.png'


export default function TestDao() {

    return (
        <>
           <div className='voting-card status-section mt-4 test-dao'>
             <div className='pt-4 px-4'> <p>
                <span className='icon proposalicon me-3 '></span>
                <span className='back-text mb-0 vertical-align-middle'>Test DAO</span>
              </p></div><hr/>

              <Row>
                <Col lg={8} >
                    <div className='pt-2 px-4'>
              <div>
                <h2 className='common-heading'>Description</h2>
                <p>John  Create a new payment of 100000 US-DC to</p>
                <div>
                    <img src={user} className='me-3' />
                    <span className='common-text'>0x4a9...929A</span>
                </div>
              </div>
              <div className='my-4'>
                <h2 className='common-heading'>Created  By</h2>
                <div className='profile-img-voting'>
                    <img src={user} className='me-4'/>
                    <span>You</span>
                </div>
              </div>
              <div>
                <h2 className='common-heading'>Votes</h2>
               <div>
               <ProgressBar now={0} className='mb-3'/>
               </div>
              </div>
              <div className='mt-2'>
                <ul className='yes-no'>
                    <li> <span className='green-circle me-2'></span> <span>Yes</span> </li>
                    <li> 100% </li>
                    <li>10 YETT</li>
                </ul>
                <ul className='yes-no'>
                    <li> <span className='red-circle me-2'></span> <span>Yes</span> </li>
                    <li> 100% </li>
                    <li>0 YETT</li>
                </ul>
               
              </div>
              <div className='d-flex mb-5'>
                <Button className='yes-btn me-3' size="lg">
                    <span className='icon check'></span>
                    <span>Yes</span>
                </Button>
                <Button className='no-btn'>
                    <span className='icon buttn-close'></span>
                    <span>No</span>
                </Button>
              </div>
               </div>
              </Col>
              <Col lg={4} className='sm-text-center'>
                <img src={voteimg} />
              </Col>
              </Row>
             </div>
        </>
    );
}
