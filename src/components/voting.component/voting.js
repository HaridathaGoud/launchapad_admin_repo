import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Status from '../createpraposal.component/status';
import TestDao from './testdao';
import Voters from './votersgrid';
export default function Voting() {
    return (
        <>
            <div className='dao-mt'>
            <div className='d-flex align-items-center title-width-fit'>
                <span className='icon-dao back mr-2 c-pointer'onClick={handleback}></span>
                <span className='mb-0 ms-2 back-text'>Voting</span>
                </div>
                <Row>
                    <Col md={8}>
                    <TestDao></TestDao>
                    </Col>
                    <Col md={4}> 
                    <Status></Status>
                    </Col>
                </Row>
                <Voters></Voters>
            </div>
        </>
    );
}
