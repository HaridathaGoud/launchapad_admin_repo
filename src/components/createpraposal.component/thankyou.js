import React, { useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import success from '../../assets/images/thank-you.svg';
import { Link,useParams, useNavigate } from 'react-router-dom';
import StartedSteps from './proposalSteps';
import shimmers from '../shimmers/shimmers';
import PlaceHolder from '../shimmers/placeHolder';

export default function Success() {
    const params = useParams()
    const PublishShimmers = shimmers.PublishProposal(3);
    const router = useNavigate();
    const handleRedirect =()=>{
        router(`/dao/proposalview/${params.id}`)
    }
    const[loader,setLoader]=useState()
    setTimeout(() => {
        setLoader(params.id)
      }, 2000);
    return (
            <Container className='dao-mt'>
           <Link className=' title-width-fit' to={`/dao/publishproposal/${params.id}`}> <div className='d-flex align-items-center title-width-fit'>  <span className='icon-dao back mr-2 c-pointer'></span><span className='mb-0 ms-2 back-text'>Create Proposal</span></div></Link>
              <Row className='mt-5'>
                    <Col md={4}>
                        <StartedSteps formSteps={100} stepsTwo={2} stepsOne={1} stepsThree={3} number={3}/>
                    </Col>
                    <Col md={8}> 
                    {loader ?<div className='voting-card text-center success-section sm-m-2'>
                      <img src={success} alt=''></img>
                      <h1 className='testing-title'>Thank You</h1>
                      <p>Your proposal is submitted successfully!</p>
                      <Button variant="primary" type="submit"  onClick={handleRedirect}>
                      Back to publish proposal summary
                    </Button>
                   </div>:<PlaceHolder contenthtml={PublishShimmers} />}
                    </Col>
                </Row>
            </Container>
    );
}
